// Logo updated to use external image

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="Ranklao logo"
                className="w-8 h-8 rounded-lg object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ranklao
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Rankers who've proven it, now guiding you.
            </p>
          </div>
          
          {/* Exams */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Exams</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li 
                className="hover:text-primary cursor-pointer transition-colors"
                onClick={() => document.getElementById('exams')?.scrollIntoView({ behavior: 'smooth' })}
              >
                JEE Preparation
              </li>
              <li 
                className="hover:text-primary cursor-pointer transition-colors"
                onClick={() => document.getElementById('exams')?.scrollIntoView({ behavior: 'smooth' })}
              >
                NEET Preparation
              </li>
              <li 
                className="hover:text-primary cursor-pointer transition-colors"
                onClick={() => document.getElementById('exams')?.scrollIntoView({ behavior: 'smooth' })}
              >
                CA Foundation
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">Coming Soon</li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li 
                className="hover:text-primary cursor-pointer transition-colors"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Study Materials
              </li>
              <li 
                className="hover:text-primary cursor-pointer transition-colors"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Mock Tests
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">Success Stories</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Blog</li>
              <li>
                <a href="/refund-cancellation" className="hover:text-primary transition-colors">Refund & Cancellation</a>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li 
                className="hover:text-primary cursor-pointer transition-colors"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                About Us
              </li>
              <li 
                className="hover:text-primary cursor-pointer transition-colors"
                onClick={() => document.getElementById('mentors')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Become a Mentor
              </li>
              <li>
                <a href="/contact" className="hover:text-primary transition-colors">Contact Us</a>
              </li>
              <li>
                <a href="/faq" className="hover:text-primary transition-colors">FAQ</a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Ranklao. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            <a href="/refund-cancellation" className="hover:text-primary transition-colors">Refund & Cancellation</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
