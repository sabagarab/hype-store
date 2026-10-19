"use client"

import { Plus } from "@medusajs/icons"
import { useActionState, useEffect, useState } from "react"

import { addCustomerAddress } from "@lib/data/customer"
import useToggleState from "@lib/hooks/use-toggle-state"
import { HttpTypes } from "@medusajs/types"
import CountrySelect from "@modules/checkout/components/country-select"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import Button from "@modules/common/components/button"
import { Drawer, DrawerContent } from "@modules/common/components/drawer"

const AddAddress = ({
  region,
}: {
  region: HttpTypes.StoreRegion
  addresses: HttpTypes.StoreCustomerAddress[]
}) => {
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(addCustomerAddress, {
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

  return (
    <>
      <button
        className="flex h-full min-h-[220px] w-full flex-col justify-between rounded-card border border-dashed border-bone/20 p-5 text-bone/70 transition-colors duration-base ease-premium hover:border-bone/40 hover:text-bone"
        onClick={open}
        data-testid="add-address-button"
      >
        <span className="text-sm font-bold">New address</span>
        <Plus />
      </button>

      <Drawer
        open={state}
        onOpenChange={(next) => (next ? open() : close())}
        responsive
      >
        <DrawerContent title="Add address" data-testid="add-address-modal">
          <form action={formAction} className="py-5">
            <div className="flex flex-col gap-y-2">
              <div className="grid grid-cols-2 gap-x-2">
                <Input
                  label="First name"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  data-testid="first-name-input"
                />
                <Input
                  label="Last name"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  data-testid="last-name-input"
                />
              </div>
              {/* Not asked for in Lebanon; kept so saved values stay. */}
              <input type="hidden" name="company" />
              <Input
                label="Address"
                name="address_1"
                required
                autoComplete="address-line1"
                data-testid="address-1-input"
              />
              <Input
                label="Building / Floor"
                name="address_2"
                autoComplete="address-line2"
                data-testid="address-2-input"
              />
              <Input
                label="City / Area"
                name="city"
                required
                autoComplete="locality"
                data-testid="city-input"
              />
              {/* Not asked for in Lebanon; kept so saved values stay. */}
              <input type="hidden" name="province" />
              <CountrySelect
                label="Country"
                region={region}
                name="country_code"
                required
                autoComplete="country"
                data-testid="country-select"
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div
                className="py-2 text-sm text-ember"
                data-testid="address-error"
              >
                {formState.error}
              </div>
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

export default AddAddress
