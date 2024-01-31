<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

definePageMeta({
  layout: 'auth',
})

const loginSchema = toTypedSchema(
  z.object({
    email: z.string().min(1, {
      message: 'Server name is required.',
    }),
    password: z.string().min(1, {
      message: 'Password is required.',
    }),
  }),
)

const { login } = useAuthStore()

async function submit(values: any, { setErrors }: Record<string, any>) {
  try {
    await login(values)
  } catch (err: any) {
    if (err?.response?.status === 401) {
      setErrors({ password: 'Invalid credentials' })
    } else {
      // setErrors(toErrorMap(err))
    }
  }
}
</script>

<template>
  <div>
    <h2 class="mb-2 text-center text-2xl font-semibold text-header-primary">
      Test Accounts
    </h2>
    <div class="mb-8 flex justify-between text-header-secondary">
      <div>
        <p>email: google123@gmail.com</p>
        <p>password: 123123123</p>
      </div>
      <div>
        <p>email: test123@gmail.com</p>
        <p>password: 123123123</p>
      </div>
    </div>
    <h2 class="text-center text-2xl font-semibold text-header-primary">
      Welcome Back
    </h2>
    <p class="mt-2 text-center text-header-secondary">
      We're so excited to see you again!
    </p>
    <Form
      v-slot="{ errors, isSubmitting }"
      :validation-schema="loginSchema"
      class="mt-5"
      @submit="submit"
    >
      <div class="mt-5 flex flex-col space-y-2">
        <label
          for="email"
          class="text-xs font-bold uppercase text-header-secondary"
        >
          Email
          <span class="text-red-500">*</span>
        </label>
        <Field
          id="email"
          name="email"
          type="email"
          class="rounded border border-input bg-input px-4 py-2"
          :class="[errors.email && 'border-red-500']"
        />
        <ErrorMessage class="text-red-500" name="email" />
      </div>
      <div class="mt-5 flex flex-col space-y-2">
        <label
          for="password"
          class="text-xs font-bold uppercase text-header-secondary"
        >
          Password
          <span class="text-red-500">*</span>
        </label>
        <Field
          id="password"
          name="password"
          type="password"
          class="rounded border border-input bg-input px-4 py-2"
          :class="[errors.password && 'border-red-500']"
        />
        <ErrorMessage class="text-red-500" name="password" />
      </div>
      <NuxtLink class="mt-1 inline-block text-blue-500" to="/">
        Forgot Password?
      </NuxtLink>
      <BaseButton
        class="mt-5 block w-full rounded bg-brand py-2 font-semibold text-white hover:bg-brand-560 active:bg-brand-600"
        :loading="isSubmitting"
        type="submit"
      >
        Login
      </BaseButton>
      <p class="mt-1 text-sm text-muted">
        Need an account?
        <NuxtLink
          to="/register"
          class="font-semibold text-blue-500 hover:underline"
        >
          Register
        </NuxtLink>
      </p>
    </Form>
  </div>
</template>
