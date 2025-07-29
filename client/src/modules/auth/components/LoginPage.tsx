'use client'

import React from 'react'
import LoginForm from './LoginForm'
import { useAuth } from '../hooks/useAuth'
import { LoginRequest } from '../types'

export default function LoginPage() {
	const { login, loading } = useAuth()

	const handleLogin = async (loginData: LoginRequest) => {
		return await login(loginData)
	}

	return <LoginForm onSubmit={handleLogin} loading={loading} />
}
