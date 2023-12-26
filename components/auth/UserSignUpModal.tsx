import { useEffect, useState } from "react"
import clsx from "clsx"
import type { ModalProps } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { Alert, Button, Col, Form, Modal, Row, Stack } from "../bootstrap"
import { LoadingButton } from "../buttons"
import Divider from "../Divider/Divider"
import Input from "../forms/Input"
import PasswordInput from "../forms/PasswordInput"
import {
  CreateUserWithEmailAndPasswordData,
  useCreateUserWithEmailAndPassword
} from "./hooks"
import SocialSignOnButtons from "./SocialSignOnButtons"
import TermsOfServiceModal from "./TermsOfServiceModal"
import { useTranslation } from "next-i18next"

export default function UserSignUpModal({
  show,
  onHide,
  onSuccessfulSubmit
}: Pick<ModalProps, "show" | "onHide"> & {
  onSuccessfulSubmit: () => void
  onHide: () => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    trigger,
    formState: { errors, isSubmitSuccessful }
  } = useForm<CreateUserWithEmailAndPasswordData>()

  const [tosStep, setTosStep] = useState<"not-agreed" | "reading" | "agreed">(
    "not-agreed"
  )

  const showTos = tosStep === "reading"

  const createUserWithEmailAndPassword =
    useCreateUserWithEmailAndPassword(false)

  useEffect(() => {
    if (!show) {
      reset()
      setTosStep("not-agreed")
      createUserWithEmailAndPassword.reset()
    }
    // could not add a reference to createUserWithEmailAndPassword.reset to dep array without triggering an infinite effect, so:
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [show, reset])

  const onSubmit = handleSubmit(newUser => {
    const promise = createUserWithEmailAndPassword.execute(newUser)
    promise.then(onSuccessfulSubmit).catch(err => {})
  })

  async function handleContinueClick() {
    const isValid = await trigger()
    if (isValid) {
      setTosStep("reading")
    }
  }

  useEffect(() => {
    if (tosStep == "agreed") {
      const loadingbtn = document.getElementById("loading-button")
      loadingbtn?.click()
    }
  }, [tosStep])

  const { t } = useTranslation("auth")

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        aria-labelledby="sign-up-modal"
        centered
        size="lg"
        className={clsx(showTos && "opacity-0")}
      >
        <Modal.Header closeButton>
          <Modal.Title id="sign-up-modal">{t("signUp")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col md={12} className="mx-auto">
            {createUserWithEmailAndPassword.error ? (
              <Alert variant="danger">
                {createUserWithEmailAndPassword.error.message}
              </Alert>
            ) : null}

            <Form noValidate onSubmit={onSubmit}>
              <TermsOfServiceModal
                show={showTos}
                onHide={() => setTosStep("not-agreed")}
                onAgree={() => setTosStep("agreed")}
              />

              <Stack gap={3} className="mb-4">
                <Input
                  label={t("email")}
                  type="email"
                  {...register("email", {
                    required: t("emailIsRequired") ?? "An email is required."
                  })}
                  error={errors.email?.message}
                />

                <Input
                  label={t("fullName")}
                  type="text"
                  {...register("fullName", {
                    validate: value =>
                      value.trim().length >= 2 ||
                      t("errEmptyAndMinLength").toString(),
                    required: t("nameIsRequired") ?? "A full name is required."
                  })}
                  error={errors.fullName?.message}
                />

                <Row className="g-3">
                  <Col md={6}>
                    <PasswordInput
                      label={t("password")}
                      {...register("password", {
                        required:
                          t("passwordRequired") ?? "A password is required.",
                        minLength: {
                          value: 8,
                          message:
                            t("passwordLength") ??
                            "Your password must be 8 characters or longer."
                        },
                        deps: ["confirmedPassword"]
                      })}
                      error={errors.password?.message}
                    />
                  </Col>

                  <Col md={6}>
                    <PasswordInput
                      label={t("confirmPassword")}
                      {...register("confirmedPassword", {
                        required:
                          t("mustConfirmPassword") ??
                          "You must confirm your password.",
                        validate: confirmedPassword => {
                          const password = getValues("password")
                          return confirmedPassword !== password
                            ? t("mustMatch") ??
                                "Confirmed password must match password."
                            : undefined
                        }
                      })}
                      error={errors.confirmedPassword?.message}
                    />
                  </Col>
                </Row>
              </Stack>

              <Stack gap={4}>
                {tosStep == "agreed" ? (
                  <LoadingButton
                    id="loading-button"
                    type="submit"
                    className="w-100"
                    loading={createUserWithEmailAndPassword.loading}
                  >
                    {t("signUp")}
                  </LoadingButton>
                ) : (
                  <Button type="button" onClick={handleContinueClick}>
                    {t("continue")}
                  </Button>
                )}

                <Divider className="px-4">{t("or")}</Divider>

                <SocialSignOnButtons onComplete={onHide} />
              </Stack>
            </Form>
          </Col>
        </Modal.Body>
      </Modal>
    </>
  )
}
