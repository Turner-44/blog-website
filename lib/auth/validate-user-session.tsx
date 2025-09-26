import { authOptions } from './next-auth-options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

type ValidationLocation = 'UI' | 'API';

export const validateUserSession = async (
  validationLocation: ValidationLocation
) => {
  const session = await getServerSession(authOptions);

  if (validationLocation === 'UI') {
    if (!session) {
      redirect('/api/auth/signin');
    }

    if (session.user?.email !== process.env.ADMIN_EMAIL) {
      redirect('/403');
    }
  } else {
    if (!session) return new Response('Unauthorized', { status: 401 });
    if (session.user?.email !== process.env.ADMIN_EMAIL) {
      return new Response('Forbidden', { status: 403 });
    }
  }
};
