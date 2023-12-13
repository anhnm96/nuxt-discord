<script setup lang="ts">
import * as z from 'zod'
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

async function submit(values: any, { setErrors }: Record<string, any>) {
  try {
    const { data } = await useAPI('/auth/sign-in', {
      method: 'post',
      body: values,
    })
    console.log('data', data)
    // if (data) {
    //   userStore.setUser(data)
    //   router.push('/channels/me')
    // }
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
  <div class="px-content mx-auto grid h-screen max-w-7xl place-items-center">
    <div class="w-full max-w-lg -translate-y-10 space-y-4">
      <div class="flex justify-between">
        <div>
          <p>email: ma123@gmail.com</p>
          <p>password: 123123123</p>
        </div>
        <div>
          <p>email: test123@gmail.com</p>
          <p>password: 123123123</p>
        </div>
      </div>
      <div class="flex justify-center">
        <img
          class="h-20 w-20 rounded-2xl"
          src="~/assets/discord.png"
          alt="logo"
        />
      </div>
      <div class="px-content space-y-4 rounded-md bg-gray-800 pb-8 pt-4">
        <h2 class="text-center text-2xl font-semibold">Welcome Back</h2>
        <div>
          <Form
            v-slot="{ errors, isSubmitting }"
            :validation-schema="loginSchema"
            class="space-y-4"
            @submit="submit"
          >
            <div class="flex flex-col space-y-1.5">
              <label for="email" class="text-sm uppercase">Email</label>
              <Field
                id="email"
                name="email"
                type="email"
                class="rounded border border-black bg-[#313338] px-4 py-2"
                :class="[errors.email && 'border-red-400']"
              />
              <ErrorMessage class="text-red-400" name="email" />
            </div>
            <div class="flex flex-col space-y-1.5">
              <label for="password" class="text-sm uppercase">Password</label>
              <Field
                id="password"
                name="password"
                type="password"
                class="rounded border border-black bg-[#313338] px-4 py-2"
                :class="[errors.password && 'border-red-400']"
              />
              <ErrorMessage class="text-red-400" name="password" />
            </div>
            <router-link class="text-purple inline-block" to="/">
              Forgot Password?
            </router-link>
            <button
              class="bg-purple block w-full rounded py-2 font-semibold text-white"
              :loading="isSubmitting"
              type="submit"
            >
              Login
            </button>
            <p class="text-sm">
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
    </div>
  </div>
</template>
