import {MapPin, Phone, Mail} from 'lucide-react'
import {Card, CardContent} from '../ui/card.tsx'
import {Button} from '../ui/button.tsx'
import {Input} from '../ui/input.tsx'

export const Contact = () => {
    return (
        <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Have questions? We're here to help. Contact us for reservations or inquiries.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <p>227, Nguyen Van Cu street, Cho Quan ward</p>
                    <p className="text-gray-600">Ho Chi Minh city, Viet Nam</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <p>(+84) 123456789</p>
                    <p className="text-gray-600">24/7 Customer Service</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <p>paskhotel@gmail.com</p>
                    <p className="text-gray-600">Email us anytime</p>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl mb-4">Send us a message</h3>
                <form className="space-y-4">
                  <div>
                    <Input placeholder="Your Name" />
                  </div>
                  <div>
                    <Input type="email" placeholder="Your Email" />
                  </div>
                  <div>
                    <Input placeholder="Subject" />
                  </div>
                  <div>
                    <textarea 
                      className="w-full min-h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Your Message"
                    ></textarea>
                  </div>
                  <Button className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
}