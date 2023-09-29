import type { User } from '~/repositories/users/type'

export const getUserStub = (): User => {
  return {
    id: 1,
    name: 'stub_name',
    username: 'stub_username',
    email: 'stub_email',
  }
}
