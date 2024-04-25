<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { loginSchema } from '@/validations/auth'

definePageMeta({
  layout: 'auth',
})

const typedLoginSchema = toTypedSchema(loginSchema)

const { login } = useAuthStore()

async function submit(values: any, { setErrors }: Record<string, any>) {
  try {
    await login(values)
  } catch (err: any) {
    if (err?.response?.status === 401) {
      setErrors({ other: err?.response?.statusText })
    } else {
      setErrors(toErrorMap(err))
    }
  }
}
</script>

<template>
  <div>
    <h2 class="text-center text-2xl font-semibold text-header-primary">
      Welcome Back
    </h2>
    <p class="mt-2 text-center text-header-secondary">
      We're so excited to see you again!
    </p>
    <Form
      v-slot="{ errors, isSubmitting }"
      :validation-schema="typedLoginSchema"
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
          class="rounded border border-input bg-input px-4 py-2 text-header-primary"
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
          class="rounded border border-input bg-input px-4 py-2 text-header-primary"
          :class="[errors.password && 'border-red-500']"
        />
        <ErrorMessage class="text-red-500" name="password" />
      </div>
      <div>
        <ErrorMessage class="text-red-500" name="other" />
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
    <h2
      class="mb-2 mt-4 text-center text-2xl font-semibold text-header-primary"
    >
      Test Accounts
    </h2>
    <div class="flex justify-between text-header-secondary">
      <div>
        <p>email: google123@gmail.com</p>
        <p>password: 123123123</p>
      </div>
      <div>
        <p>email: test123@gmail.com</p>
        <p>password: 123123123</p>
      </div>
    </div>
  </div>
</template>
