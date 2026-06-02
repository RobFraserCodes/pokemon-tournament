"use client"

import * as React from "react"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const Form = FormProvider

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-item"
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="form-label"
      className={cn("text-sm font-semibold text-slate-900", className)}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.ComponentProps<"div">) {
  return <div data-slot="form-control" {...props} />
}

function FormDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-description"
      className={cn("text-sm text-slate-600", className)}
      {...props}
    />
  )
}

function FormMessage({
  className,
  name,
  ...props
}: React.ComponentProps<"p"> & { name?: string }) {
  const form = useFormContext()
  const error = name ? form.formState.errors[name]?.message : undefined

  if (!error) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      className={cn("text-sm font-medium text-red-700", className)}
      {...props}
    >
      {String(error)}
    </p>
  )
}

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return <Controller {...props} />
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
}
