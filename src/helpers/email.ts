import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config()

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const EMAIL_HOST = process.env.EMAIL_HOST
const EMAIL_PORT = process.env.EMAIL_PORT

export const emailRegister = async ({ email, nombre, token }: { email?: string; nombre?: string; token?: string }) => {
  const transport = nodemailer.createTransport({
    host: EMAIL_HOST,
    secure: true, // true for 465, false for other ports
    port: Number(EMAIL_PORT),
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  })

  //info del mail
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos"  <cuentas@uptask.com>',
    to: email,
    subject: 'UpTask - Confirma tu cuenta',
    text: 'Comprueba tu cuenta en UpTask',
    html: `<p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>

    <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:

    <a href="${process.env.FRONTEND_URL}/confirm/${token}">Comprobar Cuenta</a></p>

    <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `
  })
}

export const recoveryPasswordEmail = async ({ email, nombre, token }: { email?: string; nombre?: string; token?: string }) => {
  const transport = nodemailer.createTransport({
    host: EMAIL_HOST,
    secure: true, // true for 465, false for other ports
    port: Number(EMAIL_PORT),
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  }) as any

  //info del mail
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos"  <cuentas@uptask.com>',
    to: email,
    subject: 'UpTask - Reestablece tu Password',
    text: 'Reestablece tu Password',
    html: `<p>Hola: ${nombre} has solicitado reestablecer tu password</p>

    <p>Sigue siguiente enlace para generar un nuevo password:

    <a href="${process.env.FRONTEND_URL}/forget-password/${token}">Reestablecer tu Password</a></p>

    <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
    `
  })
}
