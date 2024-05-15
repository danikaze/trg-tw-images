import { input, password } from '@inquirer/prompts';

export interface InteractiveModeResult {
  username: string;
  password: string;
}

export async function interactiveMode(): Promise<InteractiveModeResult> {
  const user = await input({ message: 'Username' });
  const pass = await password({ message: 'Password' });

  return {
    username: user,
    password: pass,
  };
}
