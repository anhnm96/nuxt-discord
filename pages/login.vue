<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

definePageMeta({
  layout: false,
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
  <div class="relative h-screen w-screen">
    <img
      draggable="false"
      class="h-full w-full"
      src="~/assets/bg-auth.svg"
      aria-hidden
    />
    <div
      class="absolute left-1/2 top-1/2 w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-700 p-8"
    >
      <h2 class="text-header-primary mb-2 text-center text-2xl font-semibold">
        Test Accounts
      </h2>
      <div class="text-header-secondary mb-5 flex justify-between">
        <div>
          <p>email: google123@gmail.com</p>
          <p>password: 123123123</p>
        </div>
        <div>
          <p>email: test123@gmail.com</p>
          <p>password: 123123123</p>
        </div>
      </div>
      <h2 class="text-header-primary text-center text-2xl font-semibold">
        Welcome Back
      </h2>
      <p class="text-header-secondary mt-2 text-center">
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
            class="text-header-secondary text-xs font-bold uppercase"
            >Email</label
          >
          <Field
            id="email"
            name="email"
            type="email"
            class="border-input bg-input rounded border px-4 py-2"
            :class="[errors.email && 'border-red-400']"
          />
          <ErrorMessage class="text-red-400" name="email" />
        </div>
        <div class="mt-5 flex flex-col space-y-2">
          <label
            for="password"
            class="text-header-secondary text-xs font-bold uppercase"
            >Password</label
          >
          <Field
            id="password"
            name="password"
            type="password"
            class="border-input bg-input rounded border px-4 py-2"
            :class="[errors.password && 'border-red-400']"
          />
          <ErrorMessage class="text-red-400" name="password" />
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
  </div>
</template>
