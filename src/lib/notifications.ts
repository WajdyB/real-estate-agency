// Simple notification system for the real estate agency
// In production, you would integrate with services like SendGrid, Mailgun, or AWS SES

export interface NotificationData {
  to: string
  subject: string
  message: string
  from?: string
}

export interface MessageNotificationData {
  messageId: string
  senderName: string
  senderEmail: string
  subject: string
  content: string
  propertyTitle?: string
}

// Simulate email sending (replace with actual email service in production)
export async function sendEmailNotification(data: NotificationData): Promise<boolean> {
  try {
    // In production, replace this with actual email service
    console.log('📧 Email notification would be sent:', {
      to: data.to,
      subject: data.subject,
      message: data.message,
      from: data.from || 'noreply@agence-premium.tn'
    })
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return true
  } catch (error) {
    console.error('Error sending email notification:', error)
    return false
  }
}

// Send notification to admin/agents about new message
export async function notifyNewMessage(data: MessageNotificationData): Promise<boolean> {
  const adminEmails = [
    'admin@agence-premium.tn',
    'agent@agence-premium.tn'
  ]
  
  const subject = `Nouveau message: ${data.subject}`
  const message = `
Nouveau message reçu de ${data.senderName} (${data.senderEmail})

Sujet: ${data.subject}
${data.propertyTitle ? `Propriété: ${data.propertyTitle}` : ''}

Contenu:
${data.content}

---
Agence Premium - Système de notifications
  `.trim()

  const promises = adminEmails.map(email => 
    sendEmailNotification({
      to: email,
      subject,
      message
    })
  )

  const results = await Promise.all(promises)
  return results.every(result => result)
}

// Send confirmation to client
export async function sendMessageConfirmation(data: MessageNotificationData): Promise<boolean> {
  const subject = 'Confirmation de votre message - Agence Premium'
  const message = `
Bonjour ${data.senderName},

Nous avons bien reçu votre message concernant "${data.subject}".

Notre équipe va l'étudier et vous répondre dans les plus brefs délais.

Détails de votre demande:
${data.propertyTitle ? `Propriété: ${data.propertyTitle}` : ''}
Sujet: ${data.subject}

Cordialement,
L'équipe Agence Premium
  `.trim()

  return sendEmailNotification({
    to: data.senderEmail,
    subject,
    message
  })
}

// Send reply notification to client
export async function sendReplyNotification(
  clientEmail: string,
  clientName: string,
  originalSubject: string,
  replyContent: string
): Promise<boolean> {
  const subject = `Réponse à votre demande: ${originalSubject}`
  const message = `
Bonjour ${clientName},

Voici la réponse à votre demande concernant "${originalSubject}":

${replyContent}

---
Cordialement,
L'équipe Agence Premium
  `.trim()

  return sendEmailNotification({
    to: clientEmail,
    subject,
    message
  })
}

// Appointment notification interfaces
export interface AppointmentNotificationData {
  clientName: string
  clientEmail: string
  propertyTitle: string
  appointmentDate: string
  appointmentTime: string
  status: string
  agentName?: string
  agentEmail?: string
}

// Send appointment confirmation to client
export async function sendAppointmentConfirmation(data: AppointmentNotificationData): Promise<boolean> {
  const subject = `Rendez-vous confirmé: ${data.propertyTitle}`
  const message = `
Bonjour ${data.clientName},

Votre rendez-vous pour la visite de "${data.propertyTitle}" a été confirmé.

Date: ${data.appointmentDate}
Heure: ${data.appointmentTime}

Nous vous attendons !

Cordialement,
L'équipe Agence Premium
  `.trim()

  return sendEmailNotification({
    to: data.clientEmail,
    subject,
    message
  })
}

// Send appointment cancellation to client
export async function sendAppointmentCancellation(data: AppointmentNotificationData): Promise<boolean> {
  const subject = `Rendez-vous annulé: ${data.propertyTitle}`
  const message = `
Bonjour ${data.clientName},

Votre rendez-vous pour la visite de "${data.propertyTitle}" a été annulé.

Date: ${data.appointmentDate}
Heure: ${data.appointmentTime}

Nous vous remercions de votre compréhension.

Cordialement,
L'équipe Agence Premium
  `.trim()

  return sendEmailNotification({
    to: data.clientEmail,
    subject,
    message
  })
}

// Send appointment completion to client
export async function sendAppointmentCompletion(data: AppointmentNotificationData): Promise<boolean> {
  const subject = `Visite terminée: ${data.propertyTitle}`
  const message = `
Bonjour ${data.clientName},

Votre visite de "${data.propertyTitle}" a été marquée comme terminée.

Nous espérons que cette visite vous a été utile. N'hésitez pas à nous contacter pour toute question.

Cordialement,
L'équipe Agence Premium
  `.trim()

  return sendEmailNotification({
    to: data.clientEmail,
    subject,
    message
  })
}

// Notify agent of new appointment
export async function notifyNewAppointment(data: AppointmentNotificationData): Promise<boolean> {
  if (!data.agentEmail) return true

  const subject = `Nouveau rendez-vous: ${data.propertyTitle}`
  const message = `
Bonjour ${data.agentName || 'Agent'},

Un nouveau rendez-vous a été programmé pour "${data.propertyTitle}".

Client: ${data.clientName} (${data.clientEmail})
Date: ${data.appointmentDate}
Heure: ${data.appointmentTime}

Cordialement,
Système de notifications
  `.trim()

  return sendEmailNotification({
    to: data.agentEmail,
    subject,
    message
  })
}
