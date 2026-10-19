"use client"

import {
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@lib/data/customer"
import useToggleState from "@lib/hooks/use-toggle-state"
import { PencilSquare as Edit, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import CountrySelect from "@modules/checkout/components/country-select"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import Button from "@modules/common/components/button"
import { Drawer, DrawerContent } from "@modules/common/components/drawer"
import { Heading, Text, clx } from "@modules/common/components/ui"
import Spinner from "@modules/common/icons/spinner"
import React, { useActionState, useEffect, useState } from "react"

type EditAddressProps = {
  region: HttpTypes.StoreRegion
  address: HttpTypes.StoreCustomerAddress
  isActive?: boolean
}

const EditAddress: React.FC<EditAddressProps> = ({
  region,
  address,
  isActive = false,
}) => {
  const [removing, setRemoving] = useState(false)
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(updateCustomerAddress, {
    success: false,
    error: null,
  } as { success: boolean; error: string | null })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  const removeAddress = async () => {
    setRemoving(true)
    await deleteCustomerAddress(address.id)
    setRemoving(false)
  }

  return (
    <>
      <div
        className={clx(
          "flex h-full min-h-[220px] w-full flex-col justify-between rounded-card border bg-ink p-5 transition-colors duration-base ease-premium",
          isActive ? "border-ember" : "border-hairline"
        )}
        data-testid="address-container"
      >
        <div className="flex flex-col">
          <Heading
            className="text-left text-sm font-bold"
            data-testid="address-name"
          >
            {address.first_name} {address.last_name}
          </Heading>
          <Text className="flex flex-col text-left text-sm mt-2">
            <span data-testid="address-address">
              {address.address_1}
              {address.address_2 && <span>, {address.address_2}</span>}
            </span>
            <span data-testid="address-postal-city">
              {[address.postal_code, address.city].filter(Boolean).join(", ")}
            </span>
            <span data-testid="address-province-country">
              {address.country_code?.toUpperCase()}
            </span>
          </Text>
        </div>
        <div className="flex items-center gap-x-4">
          <button
            className="flex min-h-control-sm items-center gap-x-2 text-xs text-bone transition-colors duration-base ease-premium hover:text-ember"
            onClick={open}
            data-testid="address-edit-button"
          >
            <Edit />
            Edit
          </button>
          <button
            className="flex min-h-control-sm items-center gap-x-2 text-xs text-bone transition-colors duration-base ease-premium hover:text-ember"
            onClick={removeAddress}
            data-testid="address-delete-button"
          >
            {removing ? <Spinner /> : <Trash />}
            Remove
          </button>
        </div>
      </div>

      <Drawer
        open={state}
        onOpenChange={(next) => (next ? open() : close())}
        responsive
      >
        <DrawerContent title="Edit address" data-testid="edit-address-modal">
          <form action={formAction} className="py-5">
            <input type="hidden" name="addressId" value={address.id} />
            <div className="grid grid-cols-1 gap-y-2">
              <div className="grid grid-cols-2 gap-x-2">
                <Input
                  label="First name"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  defaultValue={address.first_name || undefined}
                  data-testid="first-name-input"
                />
                <Input
                  label="Last name"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  defaultValue={address.last_name || undefined}
                  data-testid="last-name-input"
                />
              </div>
              {/* Not asked for in Lebanon; kept so saved values stay. */}
              <input
                type="hidden"
                name="company"
                defaultValue={address.company ?? ""}
              />
              <Input
                label="Address"
                name="address_1"
                required
                autoComplete="address-line1"
                defaultValue={address.address_1 || undefined}
                data-testid="address-1-input"
              />
              <Input
                label="Building / Floor"
                name="address_2"
                autoComplete="address-line2"
                defaultValue={address.address_2 || undefined}
                data-testid="address-2-input"
              />
              <Input
                label="City / Area"
                name="city"
                required
                autoComplete="locality"
                defaultValue={address.city || undefined}
                data-testid="city-input"
              />
              {/* Not asked for in Lebanon; kept so saved values stay. */}
              <input
                type="hidden"
                name="province"
                defaultValue={address.province ?? ""}
              />
              <CountrySelect
                label="Country"
                name="country_code"
                region={region}
                required
                autoComplete="country"
                defaultValue={address.country_code || undefined}
                data-testid="country-select"
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                defaultValue={address.phone || undefined}
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div className="py-2 text-sm text-ember">{formState.error}</div>
            )}
            <div className="flex gap-3 mt-6">
              <Button
                type="reset"
                variant="secondary"
                onClick={close}
                className="flex-1"
                data-testid="cancel-button"
              >
                Cancel
              </Button>
              <SubmitButton className="flex-1" data-testid="save-button">
                Save
              </SubmitButton>
            </div>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default EditAddress
