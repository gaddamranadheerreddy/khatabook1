import { Platform, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { AuthRequest, ResponseType, Prompt } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
  getCompanies,
  getPeopleWithBalances,
  getTransactionsByPerson,
  addCompany,
  addPerson,
  deletePerson,
  addTransaction,
  getPersonById,
} from '@/database/service';

type BackupPayload = {
  version: 1;
  generatedAt: number;
  companyFilterId: number | null;
  companies: any[];
  people: any[];
  transactions: any[];
};

function filename(companyId: number | null) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const scope = companyId == null ? 'all' : `company-${companyId}`;
  return `MyKhata_${scope}_backup_${ts}.json`;
}

async function collectBackupData(companyId: number | null): Promise<BackupPayload> {
  const companies = await getCompanies();
  const people = await getPeopleWithBalances(companyId);
  const transactions: any[] = [];

  for (const p of people) {
    const txns = await getTransactionsByPerson(p.id);
    for (const t of txns) {
      transactions.push(t);
    }
  }

  return {
    version: 1,
    generatedAt: Date.now(),
    companyFilterId: companyId ?? null,
    companies,
    people,
    transactions,
  };
}

async function uploadMultipartDrive(accessToken: string, name: string, content: string) {
  const meta = { name, mimeType: 'application/json' };
  const boundary = 'drive-boundary-' + Math.random().toString(36).slice(2);

  const body =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(meta)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: application/json\r\n\r\n` +
    `${content}\r\n` +
    `--${boundary}--`;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Drive upload failed (${res.status}): ${text}`);
  }

  return res.json();
}

declare global {
  interface Window {
    google?: any;
  }
}

let webTokenClient: any | null = null;

function ensureGoogleIdentityScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const hasClient = !!window.google?.accounts?.oauth2;
    if (hasClient) {
      resolve();
      return;
    }
    const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google script')));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google script'));
    document.head.appendChild(script);
  });
}

export async function prepareGoogleWebAuth(clientId?: string): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!clientId) return;
  if (window.google?.accounts?.oauth2) {
    if (!webTokenClient) {
      webTokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: () => {},
      });
    }
    return;
  }
  await ensureGoogleIdentityScript();
  if (window.google?.accounts?.oauth2 && !webTokenClient) {
    webTokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: () => {},
  });
}
}

async function getGoogleAccessTokenWeb(clientId?: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    if (!clientId) {
      reject(new Error('Missing EXPO_PUBLIC_GOOGLE_CLIENT_ID'));
      return;
    }
    const oauth2 = window.google?.accounts?.oauth2;
    if (!oauth2) {
      reject(new Error('Google auth not ready. Please try again.'));
      return;
    }
    if (!webTokenClient) {
      webTokenClient = oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: () => {},
      });
    }
    webTokenClient.callback = (resp: any) => {
      if (resp?.access_token) resolve(resp.access_token);
      else reject(new Error('Failed to retrieve access token'));
    };
    try {
      webTokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (e) {
      reject(e);
    }
  });
}

async function getGoogleAccessTokenNative(clientId?: string): Promise<string> {
  if (!clientId) {
    throw new Error('Missing EXPO_PUBLIC_GOOGLE_CLIENT_ID');
  }
  WebBrowser.maybeCompleteAuthSession();

  const redirectUri = AuthSession.makeRedirectUri();

  const request = new AuthRequest({
    clientId,
    redirectUri,
    responseType: ResponseType.Token,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
    prompt: Prompt.Consent,
    usePKCE: false,
  });

  const discovery = { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' };
  const result = await request.promptAsync(discovery);

  if (result.type !== 'success' || !result.params?.access_token) {
    throw new Error('Google authentication failed');
  }
  return result.params.access_token as string;
}

export async function backupToGoogleDrive(companyId: number | null) {
  const clientId =
    Platform.OS === 'android'
      ? process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID
      : Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID
      : process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

  if (Platform.OS === 'web') {
    try {
      const token = await getGoogleAccessTokenWeb(clientId);
      const payload = await collectBackupData(companyId);
      const name = filename(companyId);
      const content = JSON.stringify(payload);
      await uploadMultipartDrive(token, name, content);
      alert('Backup uploaded to Google Drive');
    } catch (e: any) {
      alert(`Backup failed: ${e?.message ?? 'Unknown error'}`);
    }
    return;
  }

  try {
    const token = await getGoogleAccessTokenNative(clientId);
    const payload = await collectBackupData(companyId);
    const name = filename(companyId);
    const content = JSON.stringify(payload);
    await uploadMultipartDrive(token, name, content);
    Alert.alert('Backup', 'Uploaded to Google Drive');
  } catch (e: any) {
    Alert.alert('Backup failed', e?.message ?? 'Unknown error');
  }
}

async function latestBackupFileId(accessToken: string) {
  const q = encodeURIComponent(`name contains 'MyKhata_' and mimeType = 'application/json'`);
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&orderBy=modifiedTime desc&pageSize=1&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (!res.ok) throw new Error('Failed to list backup files');
  const data = await res.json();
  const file = data.files?.[0];
  if (!file?.id) throw new Error('No backup files found in Drive');
  return file.id as string;
}

async function downloadBackup(accessToken: string, fileId: string): Promise<BackupPayload> {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error('Failed to download backup file');
  const json = await res.json();
  return json as BackupPayload;
}

async function findOrCreateCompany(name: string, note?: string | null) {
  const companies = await getCompanies();
  const found = companies.find((c: any) => c.name === name);
  if (found) return found.id;
  const id = await addCompany(name, note ?? undefined);
  return id;
}

async function findOrCreatePerson(companyId: number, person: any) {
  const people = await getPeopleWithBalances(companyId);
  const found = people.find(
    (p: any) => p.name === person.name && (p.phone ?? null) === (person.phone ?? null)
  );
  if (found) return found.id;
  const id = await addPerson({ company_id: companyId, name: person.name, phone: person.phone ?? null });
  return id;
}

async function applyMerge(payload: BackupPayload) {
  const companyMap = new Map<number, number>();

  for (const company of payload.companies) {
    const newId = await findOrCreateCompany(company.name, company.note ?? null);
    companyMap.set(company.id, newId);
  }

  const personMap = new Map<number, number>();

  for (const person of payload.people) {
    const newCompanyId = companyMap.get(person.company_id);
    if (!newCompanyId) continue;
    const newPersonId = await findOrCreatePerson(newCompanyId, person);
    personMap.set(person.id, newPersonId);
  }

  for (const txn of payload.transactions) {
    const newPersonId = personMap.get(txn.person_id);
    if (!newPersonId) continue;

    const existing = await getTransactionsByPerson(newPersonId);
    const dup = existing.find(
      (t: any) =>
        t.date === txn.date &&
        t.amount === txn.amount &&
        t.type === txn.type &&
        (t.note ?? null) === (txn.note ?? null)
    );
    if (!dup) {
      await addTransaction({
        person_id: newPersonId,
        amount: txn.amount,
        type: txn.type,
        note: txn.note ?? null,
        date: txn.date,
      });
    }
  }
}

async function applyReplace(payload: BackupPayload) {
  const targetCompanyIds =
    payload.companyFilterId == null
      ? (await getCompanies()).map((c: any) => c.id)
      : [payload.companyFilterId];

  for (const cid of targetCompanyIds) {
    const people = await getPeopleWithBalances(cid);
    for (const p of people) {
      await deletePerson(p.id);
    }
  }

  await applyMerge(payload);
}

export async function restoreFromGoogleDrive(mode: 'replace' | 'merge' = 'merge') {
  const clientId =
    Platform.OS === 'android'
      ? process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID
      : Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID
      : process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

  const token =
    Platform.OS === 'web'
      ? await getGoogleAccessTokenWeb(clientId)
      : await getGoogleAccessTokenNative(clientId);

  const fileId = await latestBackupFileId(token);
  const payload = await downloadBackup(token, fileId);

  if (mode === 'replace') {
    await applyReplace(payload);
  } else {
    await applyMerge(payload);
  }

  if (Platform.OS === 'web') {
    alert(`Restore (${mode}) completed`);
  } else {
    Alert.alert('Restore complete', `Mode: ${mode}`);
  }
}
