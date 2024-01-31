<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

definePageMeta({
  layout: 'auth',
})

const registerSchema = toTypedSchema(
  z.object({
    username: z.string().min(3).max(30).trim(),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(150),
  }),
)

async function submit(values: any, { setErrors }: Record<string, any>) {
  try {
    const { data } = await useAPI('/auth/sign-up', {
      method: 'post',
      body: values,
    })
    console.log('data', data)
    // const { data } = await register(values)
    // if (data) {
    //   userStore.setUser(data)
    //   router.push('/channels/me')
    // }
  } catch (err: any) {
    if (err?.response?.data?.errors) {
      // setErrors(toErrorMap(err))
    }
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
      :validation-schema="registerSchema"
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
          class="rounded border border-input bg-input px-4 py-2"
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
          class="rounded border border-input bg-input px-4 py-2"
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
          class="rounded border border-input bg-input px-4 py-2"
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
