import {Hotel} from 'lucide-react'
import {Button} from '../component/ui/button.tsx'
import {Input} from '../component/ui/input.tsx'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Hotel className="h-6 w-6" />
                <span className="text-lg">PASK Hotel</span>
              </div>
              <p className="text-gray-400">
                Your home away from home. Experience luxury and comfort.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#rooms" className="hover:text-white transition-colors">Rooms</a></li>
                <li><a href="#amenities" className="hover:text-white transition-colors">Amenities</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Policies</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cancellation Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">
                Subscribe for exclusive offers and updates.
              </p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Your email" 
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PASK Hotel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}

export default Footer