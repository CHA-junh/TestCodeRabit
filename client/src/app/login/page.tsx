import { redirect } from 'next/navigation'

export default function LoginPage() {
	redirect('/signin')
	return null
}


