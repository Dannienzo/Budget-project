import React from 'react';
import { DollarSign, ArrowRight, TrendingUp, Shield, Users, Divide } from 'lucide-react';


const BannerPage = () => {
  const styles = {  
    banner: {
      minHeight: '100vh',
      backgroundImage: 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.85) 0%, rgba(59, 130, 246, 0.75) 50%, rgba(139, 92, 246, 0.8) 100%)',
      backdropFilter: 'blur(1px)'
    },
    content: {
      position: 'relative',
      zIndex: 10,
      maxWidth: '800px',
      textAlign: 'center',
      color: 'white'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '2rem'
    },
    logoIcon: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: '50%',
      padding: '1.2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid rgba(255, 255, 255, 0.3)'
    },
    brandText: {
      fontSize: '3rem',
      fontWeight: '700',
      margin: 0,
      textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      letterSpacing: '-0.02em'
    },
    headline: {
      fontSize: '3.5rem',
      fontWeight: '800',
      lineHeight: '1.1',
      marginBottom: '1.5rem',
      textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
      letterSpacing: '-0.02em'
    },
    subheadline: {
      fontSize: '1.4rem',
      fontWeight: '400',
      lineHeight: '1.5',
      marginBottom: '2.5rem',
      color: 'rgba(255, 255, 255, 0.9)',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      maxWidth: '600px',
      margin: '0 auto 2.5rem auto'
    },
    ctaContainer: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: '3rem'
    },
    primaryButton: {
      backgroundColor: 'white',
      color: '#1e40af',
      padding: '1.2rem 2.5rem',
      borderRadius: '50px',
      textDecoration: 'none',
      fontSize: '1.1rem',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
      border: 'none',
      cursor: 'pointer'
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: 'white',
      padding: '1.2rem 2.5rem',
      borderRadius: '50px',
      textDecoration: 'none',
      fontSize: '1.1rem',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s ease',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      cursor: 'pointer',
      backdropFilter: 'blur(10px)'
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      marginTop: '4rem'
    },
    feature: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '1.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'transform 0.3s ease'
    },
    featureIcon: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      padding: '1rem',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    featureTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      margin: '0 0 0.5rem 0',
      color: 'white'
    },
    featureText: {
      fontSize: '0.9rem',
      color: 'rgba(255, 255, 255, 0.8)',
      lineHeight: '1.4',
      margin: 0
    },
    trustIndicator: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '2rem',
      marginTop: '3rem',
      flexWrap: 'wrap'
    },
    trustItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '0.9rem'
    }
  };

  return (
 <div>

     <div style={styles.banner}>
      <div style={styles.overlay}></div>
      
      <div style={styles.content}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <DollarSign size={32} color="white" />
          </div>
          <h1 style={styles.brandText}>Smart Budget</h1>
        </div>
        
        <h2 style={styles.headline}>
          Master Your Financial Future
        </h2>
        
        <p style={styles.subheadline}>
          Professional budgeting tools designed for modern professionals. 
          Track expenses, optimize spending, and achieve your financial goals with confidence.
        </p>
        
        <div style={styles.ctaContainer}>
          <button 
            style={styles.primaryButton}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
          >
            Start Free Trial
            <ArrowRight size={20} />
          </button>
          
          <button 
            style={styles.secondaryButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            Watch Demo
          </button>
        </div>
        
        <div style={styles.features}>
          <div 
            style={styles.feature}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={styles.featureIcon}>
              <TrendingUp size={24} color="white" />
            </div>
            <h3 style={styles.featureTitle}>Advanced Analytics</h3>
            <p style={styles.featureText}>
              Deep insights into your spending patterns and financial trends
            </p>
          </div>
          
          <div 
            style={styles.feature}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={styles.featureIcon}>
              <Shield size={24} color="white" />
            </div>
            <h3 style={styles.featureTitle}>Bank-Level Security</h3>
            <p style={styles.featureText}>
              Your financial data is protected with enterprise-grade encryption
            </p>
          </div>
          
          <div 
            style={styles.feature}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={styles.featureIcon}>
              <Users size={24} color="white" />
            </div>
            <h3 style={styles.featureTitle}>Expert Support</h3>
            <p style={styles.featureText}>
              24/7 support from certified financial planning professionals
            </p>
          </div>
        </div>
        
        <div style={styles.trustIndicator}>
          <div style={styles.trustItem}>
            <Shield size={16} />
            <span>Trusted by 50,000+ users</span>
          </div>
          <div style={styles.trustItem}>
            <TrendingUp size={16} />
            <span>Average savings: $2,400/year</span>
          </div>
          <div style={styles.trustItem}>
            <Users size={16} />
            <span>4.9/5 customer rating</span>
          </div>
        </div>
      </div>
    </div>
 </div>
   
  );
};

export default BannerPage;