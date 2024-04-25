<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { registerSchema } from '@/validations/auth'

definePageMeta({
  layout: 'auth',
})

const typedRegisterSchema = toTypedSchema(registerSchema)

const { register } = useAuthStore()

async function submit(values: any, { setErrors }: Record<string, any>) {
  try {
    await register(values)
  } catch (err: any) {
    setErrors(toErrorMap(err))
  }
}
</script>

<template>
  <div>
    <h2 class="text-center text-2xl font-semibold text-header-primary">
      Create an account
    </h2>
    <Form
      v-slot="{ errors, isSubmitting }"
      :validation-schema="typedRegisterSchema"
      class="mt-5 space-y-5"
      @submit="submit"
    >
      <div class="flex flex-col space-y-2">
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
      <div class="flex flex-col space-y-2">
        <label
          for="username"
          class="text-xs font-bold uppercase text-header-secondary"
        >
          Username
          <span class="text-red-500">*</span>
        </label>
        <Field
          id="username"
          name="username"
          type="text"
          class="rounded border border-input bg-input px-4 py-2 text-header-primary"
          :class="[errors.username && 'border-red-500']"
        />
        <ErrorMessage class="text-red-500" name="username" />
      </div>
      <div class="flex flex-col space-y-2">
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
      <BaseButton
        class="block w-full rounded bg-brand py-2 font-semibold text-white transition hover:bg-brand-560 active:bg-brand-600"
        :loading="isSubmitting"
        type="submit"
      >
        Register
      </BaseButton>
      <NuxtLink to="/login" class="block text-blue-500 hover:underline">
        Already have an account?
      </NuxtLink>
    </Form>
  </div>
</template>
