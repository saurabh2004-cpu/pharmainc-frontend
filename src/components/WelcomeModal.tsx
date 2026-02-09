'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  fullName: string
  phoneNumber: string
  emailAddress: string
  profession: string
  otherProfession: string
}

const professionOptions = [
  'Doctor',
  'Pharmacist',
  'Nurse',
  'Medical Student',
  'Pharmacy Student',
  'Nursing Student',
  'Researcher',
  'Healthcare Administrator',
  'Other'
]

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSurveyPrompt, setShowSurveyPrompt] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    profession: '',
    otherProfession: ''
  })

  const showOtherInput = formData.profession === 'Other'

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleProfessionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      profession: value,
      otherProfession: value === 'Other' ? prev.otherProfession : ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSubmitted(true)
      setTimeout(() => {
        setShowSurveyPrompt(true)
      }, 1500)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSurveyClick = () => {
    window.open('about:blank', '_blank')
    onClose()
  }

  const handleClose = () => {
    setIsSubmitted(false)
    setShowSurveyPrompt(false)
    setFormData({
      fullName: '',
      phoneNumber: '',
      emailAddress: '',
      profession: '',
      otherProfession: ''
    })
    setError('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-xl">
        <DialogHeader className="relative">
          <button
            onClick={handleClose}
            className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogTitle className="text-xl font-semibold text-center pr-6 text-gray-900">
            {!isSubmitted ? (
              "Your future network is already forming. The only thing missing is you. Join Pharminc now."
            ) : showSurveyPrompt ? (
              "One more thing..."
            ) : (
              "Welcome to Pharminc!"
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-gray-700">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  required
                  placeholder="Enter your phone number"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailAddress" className="text-gray-700">Email Address *</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession" className="text-gray-700">Profession *</Label>
                <Select value={formData.profession} onValueChange={handleProfessionChange} required>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select your profession" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    {professionOptions.map((profession) => (
                      <SelectItem key={profession} value={profession} className="hover:bg-blue-50">
                        {profession}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showOtherInput && (
                <div className="space-y-2">
                  <Label htmlFor="otherProfession" className="text-gray-700">Please specify *</Label>
                  <Input
                    id="otherProfession"
                    type="text"
                    value={formData.otherProfession}
                    onChange={(e) => handleInputChange('otherProfession', e.target.value)}
                    required
                    placeholder="Enter your profession"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Joining..." : "Join Now"}
              </Button>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </form>
          ) : (
            <div className="text-center space-y-4">
              {!showSurveyPrompt ? (
                <p className="text-lg text-gray-700">
                  Thanks for joining Pharminc! We're thrilled to have you onboard.
                </p>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-700">
                    We'd love to get to know you better! Would you be open to filling out a quick 5-minute survey to help shape the future of Pharminc?
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={handleSurveyClick} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Take the Survey
                    </Button>
                    <Button onClick={handleClose} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      Maybe Later
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
