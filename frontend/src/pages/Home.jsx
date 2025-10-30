import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from "../components/Icon";

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({});

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Polls Created' },
    { number: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="min-h-screen w-full h-full bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            left: '10%',
            top: '20%'
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-accent/10 to-primary/10 blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            right: '10%',
            bottom: '30%'
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
            <div 
              id="hero-content"
              data-animate
              className={`transform transition-all duration-1000 ${
                isVisible['hero-content'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/30 text-sm mb-6 group hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse"></span>
                  <span className="absolute h-2 w-2 rounded-full bg-success animate-ping"></span>
                </div>
                <span className="font-medium">Secure • Transparent • Real‑time</span>
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs">✨</span>
                </div>
              </div>

              {/* Main heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
                <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-x">
                  Shape the
                </span>
                <span className="block text-base-content/90">
                  outcome with a
                </span>
                <span className="block bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent animate-gradient-x">
                  single vote
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl text-base-content/70 max-w-2xl mb-8 leading-relaxed">
                VoteApp lets communities run trustworthy polls with live results, fraud protection, and a 
                <span className="text-primary font-semibold"> delightful experience</span> for voters and administrators.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/signup" 
                  className="group relative px-8 py-4 bg-gradient-to-r from-primary to-secondary text-primary-content font-bold rounded-2xl shadow-2xl hover:shadow-primary/25 hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    Get started — it's free
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link 
                  to="/login" 
                  className="px-8 py-4 bg-base-200/50 backdrop-blur-sm text-base-content border border-base-300 hover:border-primary/50 hover:bg-base-200/70 font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  I already have an account
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 text-sm text-base-content/60">
                <div className="flex -space-x-2">
                  {[
                    { name: 'sparkles', color: 'text-yellow-400' },
                    { name: 'shield', color: 'text-blue-400' },
                    { name: 'zap', color: 'text-purple-400' },
                    { name: 'rocket', color: 'text-green-400' }
                  ].map((icon, index) => (
                    <div 
                      key={index}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-base-300/50 flex items-center justify-center hover:scale-110 transition-transform duration-300"
                    >
                      <Icon name={icon.name} size="md" className={icon.color} />
                    </div>
                  ))}
                </div>
                <span className="font-medium">Trusted by student clubs, teams, and communities worldwide</span>
              </div>
            </div>

            {/* Interactive demo card */}
            <div 
              id="demo-card"
              data-animate
              className={`relative transform transition-all duration-1000 delay-300 ${
                isVisible['demo-card'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-2xl rounded-3xl animate-pulse"></div>
              <div className="relative rounded-3xl border border-base-300/50 bg-base-100/80 backdrop-blur-xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                <div className="grid gap-6">
                  {/* Live Results Panel */}
                  <div className="rounded-2xl bg-gradient-to-br from-base-200/50 to-base-300/30 p-6 border border-base-300/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base-content/80 font-semibold">Live Results</h3>
                      <div className="flex items-center gap-2 text-xs text-success font-medium">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                        Real-time
                      </div>
                    </div>
                    <div className="h-40 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 flex items-end gap-3 p-4 relative overflow-hidden">
                      {[65, 45, 80, 25].map((height, index) => (
                        <div 
                          key={index}
                          className={`flex-1 rounded-t-lg transition-all duration-1000 hover:scale-105 cursor-pointer ${
                            index === 0 ? 'bg-gradient-to-t from-primary to-primary/70' :
                            index === 1 ? 'bg-gradient-to-t from-secondary to-secondary/70' :
                            index === 2 ? 'bg-gradient-to-t from-accent to-accent/70' :
                            'bg-gradient-to-t from-neutral to-neutral/70'
                          }`}
                          style={{ 
                            height: `${height}%`,
                            animationDelay: `${index * 200}ms`
                          }}
                        />
                      ))}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="rounded-2xl bg-gradient-to-br from-base-200/50 to-base-300/30 p-6 border border-base-300/30">
                    <h3 className="text-base-content/80 font-semibold mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                      {['Create poll', 'Add candidate', 'Share link', 'View analytics'].map((action, index) => (
                        <button 
                          key={index}
                          className="px-4 py-2 bg-base-100/80 hover:bg-primary/20 border border-base-300/50 hover:border-primary/50 text-base-content/80 text-sm rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 border-t border-base-300/50 bg-base-200/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                id={`stat-${index}`}
                data-animate
                className={`text-center transform transition-all duration-1000 ${
                  isVisible[`stat-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-base-content/60 mt-2 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features"
        data-animate
        className="relative py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-base-content mb-4">
              Why choose <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">VoteApp</span>?
            </h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Built for modern communities with security, speed, and simplicity in mind.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature 
              icon={<Icon name="chart-bar" size="2xl" className="text-blue-400" />}
              title="Real-time insights" 
              desc="Follow results live with beautiful, responsive charts and detailed analytics dashboards."
              gradient="from-blue-500/20 to-cyan-500/20"
            />
            <Feature 
              icon={<Icon name="zap" size="2xl" className="text-yellow-400" />}
              title="Lightning fast" 
              desc="Create a poll and invite voters in minutes, not hours. Optimized for speed and simplicity."
              gradient="from-yellow-500/20 to-orange-500/20"
            />
            <Feature 
              icon={<Icon name="palette" size="2xl" className="text-purple-400" />}
              title="Beautiful interface" 
              desc="Modern, intuitive design that works perfectly on any device with smooth animations."
              gradient="from-purple-500/20 to-indigo-500/20"
            />
            <Feature 
              icon={<Icon name="globe" size="2xl" className="text-green-400" />}
              title="Share anywhere" 
              desc="Generate secure voting links that work on any device, anywhere in the world."
              gradient="from-green-500/20 to-teal-500/20"
            />
            <Feature 
              icon={<Icon name="phone" size="2xl" className="text-indigo-400" />}
              title="Mobile first" 
              desc="Optimized for mobile voting with offline support and progressive web app features."
              gradient="from-indigo-500/20 to-purple-500/20"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta"
        data-animate
        className="relative py-20"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-sm border border-primary/30 p-12 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-black text-base-content mb-4">
                Ready to run your next poll?
              </h2>
              <p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
                Join thousands of communities already using VoteApp. It's free to start, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/signup" 
                  className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-content font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Create your account
                </Link>
                <Link 
                  to="/login" 
                  className="px-8 py-4 bg-base-100/80 hover:bg-base-100 border border-base-300/50 hover:border-primary/50 text-base-content font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  Sign in instead
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-base-300/50 bg-base-200/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-primary-content font-bold">V</span>
                </div>
                <span className="text-xl font-bold text-base-content">VoteApp</span>
              </div>
              <p className="text-base-content/60 text-sm">
                Modern voting platform for communities worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-base-content mb-3">Product</h3>
              <div className="space-y-2 text-sm text-base-content/60">
                <div>Features</div>
                <div>Security</div>
                <div>Pricing</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-base-content mb-3">Company</h3>
              <div className="space-y-2 text-sm text-base-content/60">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-base-content mb-3">Support</h3>
              <div className="space-y-2 text-sm text-base-content/60">
                <div>Help Center</div>
                <div>Contact</div>
                <div>Status</div>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-base-300/50 text-center text-sm text-base-content/60">
            &copy; {new Date().getFullYear()} VoteApp. Built for modern community voting.
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

function Feature({ icon, title, desc, gradient }) {
  return (
    <div className={`group relative rounded-2xl bg-gradient-to-br ${gradient} backdrop-blur-sm border border-base-300/30 p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-base-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative">
        <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-base-content/70 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

export default Home;