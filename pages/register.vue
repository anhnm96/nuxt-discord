<script setup lang="ts">
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

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
  <div class="px-content mx-auto grid h-screen max-w-7xl place-items-center">
    <div class="w-full max-w-lg space-y-4">
      <div class="flex justify-center">
        <img
          class="h-20 w-20 rounded-2xl"
          src="~/assets/discord.png"
          alt="logo"
        />
      </div>
      <div class="px-content space-y-4 rounded-md bg-gray-800 pb-8 pt-4">
        <h2 class="text-center text-2xl font-semibold">Welcome to Discord</h2>
        <div>
          <Form
            v-slot="{ errors, isSubmitting }"
            :validation-schema="registerSchema"
            class="space-y-4"
            @submit="submit"
          >
            <div class="flex flex-col space-y-1.5">
              <label for="email" class="text-sm uppercase">Email</label>
              <Field
                id="email"
                name="email"
                type="email"
                class="bg-secondary-alt rounded border border-black px-4 py-2"
                :class="[errors.email && 'border-red-400']"
              />
              <ErrorMessage class="text-red-400" name="email" />
            </div>
            <div class="flex flex-col space-y-1.5">
              <label for="username" class="text-sm uppercase">Username</label>
              <Field
                id="username"
                name="username"
                type="text"
                class="bg-secondary-alt rounded border border-black px-4 py-2"
                :class="[errors.username && 'border-red-400']"
              />
              <ErrorMessage class="text-red-400" name="username" />
            </div>
            <div class="flex flex-col space-y-1.5">
              <label for="password" class="text-sm uppercase">Password</label>
              <Field
                id="password"
                name="password"
                type="password"
                class="bg-secondary-alt rounded border border-black px-4 py-2"
                :class="[errors.password && 'border-red-400']"
              />
              <ErrorMessage class="text-red-400" name="password" />
            </div>
            <button
              class="bg-purple block w-full rounded py-2 font-semibold text-white"
              :loading="isSubmitting"
              type="submit"
            >
              Register
            </button>
            <p>
              Already have an account?
              <NuxtLink to="/signin" class="text-blue-500 hover:underline">
                Sign In
              </NuxtLink>
            </p>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>
