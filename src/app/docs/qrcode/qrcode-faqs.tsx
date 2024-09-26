import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'


type UserType = 'attendees' | 'publishers'

interface FAQSectionProps {
  activeTab: UserType,
}

const QRCodeFAQSection: React.FC<FAQSectionProps> = ({ activeTab }) => {
  const attendeeFAQs = [
    {
      question: "What if I lose my QR code?",
      answer: "If you lose your QR code, you can easily access it by logging into your account. You can also find a copy in your registered email."
    },
    {
      question: "Can I share my QR code with others?",
      answer: "No, your QR code is unique to you and should not be shared. Each QR code can only be used once for event entry."
    },
    {
      question: "What if my QR code doesn't scan?",
      answer: "If your QR code doesn't scan, please see an event staff member for assistance. They can manually check you in."
    },
    {
      question: "Can I use the same QR code for multiple events?",
      answer: "No, each QR code is specific to a single event. You'll receive a new QR code for each event you purchase a ticket for."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take data security seriously. Your personal information is encrypted and stored securely. The QR code itself doesn't contain any personal data."
    }
  ]

  const publisherFAQs = [
    {
      question: "What devices can I use to scan QR codes?",
      answer: "You can use any smartphone or tablet with a camera and ShowtimeAfrica app installed. We support both iOS and Android devices."
    },
    {
      question: "How do I handle network issues during scanning?",
      answer: "Our app has an offline mode that allows you to continue scanning. It will sync the data once the connection is restored."
    },
    {
      question: "Can multiple staff members scan QR codes simultaneously?",
      answer: "Yes, multiple staff members can scan QR codes at the same time using different devices. All scans are synchronized in real-time."
    },
    {
      question: "How do I deal with duplicate or fraudulent QR codes?",
      answer: "Our system automatically detects and flags duplicate or invalid QR codes. If this occurs, please direct the attendee to the event support desk."
    },
    {
      question: "Can I get real-time attendance reports?",
      answer: "Yes, you can access real-time attendance reports and analytics through the publisher dashboard on our website or mobile app."
    }
  ]

  const faqs = activeTab === 'attendees' ? attendeeFAQs : publisherFAQs

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-semibold mb-8 text-center">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

export default QRCodeFAQSection;