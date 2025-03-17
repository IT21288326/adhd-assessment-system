import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const NavigationBar = ({ child }) => {
  const [showDropdown, setShowDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8800/api/auth/logout", {}, {
        withCredentials: true
      });
      navigate("/signin");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleMouseEnter = (menuName) => {
    if (windowWidth > 768) {
      setShowDropdown(menuName);
    }
  };

  const handleMouseLeave = () => {
    if (windowWidth > 768) {
      setShowDropdown(null);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileDropdown = (menuName) => {
    if (showDropdown === menuName) {
      setShowDropdown(null);
    } else {
      setShowDropdown(menuName);
    }
  };

  const menuItems = [
    {
      name: "ADHD Assessment",
      path: "/profile",
      icon: "🧠",
      subItems: [
        { name: "Reaction Time Game", path: "/reaction-time-game" },
        { name: "Parental Questionnaire", path: "/parent-questionnaire" }
      ]
    },
    {
      name: "Focus Development",
      path: "/questionnaire-form",
      icon: "🎯",
      subItems: [
        { name: "Attention Exercises", path: "/attention-exercises" },
        { name: "Focus Tracking", path: "/focus-tracking" }
      ]
    },
    {
      name: "Impulse Control",
      path: "/reaction-time-game",
      icon: "⏱️",
      subItems: [
        { name: "Patience Games", path: "/patience-games" },
        { name: "Control Challenges", path: "/control-challenges" }
      ]
    },
    {
      name: "My Progress",
      path: "/questionnaire-form",
      icon: "📊",
      subItems: [
        { name: "Progress Reports", path: "/progress-reports" },
        { name: "Activity History", path: "/activity-history" }
      ]
    }
  ];

  return (
    <nav style={{
      backgroundColor: "#87CEEB",
      padding: "12px 20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      fontFamily: "'Comic Sans MS', 'Marker Felt', sans-serif"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        {/* Logo/Home Link */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <img
              src="/assets/it21288326/pulsemindlogo.jpg" 
              alt="Logo"
              style={{
                height: "40px",
                width: "auto"
              }}
            />
            <h1 style={{
              margin: 0,
              fontSize: windowWidth < 400 ? "18px" : "24px",
              fontWeight: "bold",
              color: "#0066CC"
            }}>
              PULSE Mind
            </h1>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        {windowWidth <= 768 && (
          <button 
            onClick={toggleMobileMenu}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5px"
            }}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        )}

        {/* Desktop Navigation */}
        {windowWidth > 768 && (
          <div style={{
            display: "flex",
            gap: "20px",
            alignItems: "center"
          }}>
            {/* Main Navigation Links */}
            <div style={{
              display: "flex",
              gap: "20px"
            }}>
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  style={{ position: "relative" }}
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={item.path}
                    state={{ childId: child?._id }}
                    style={{
                      textDecoration: "none",
                      color: "#333",
                      fontWeight: "bold",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      transition: "background-color 0.3s",
                      backgroundColor: showDropdown === item.name ? "rgba(255, 255, 255, 0.3)" : "transparent",
                      fontSize: windowWidth < 1024 ? "14px" : "16px"
                    }}
                  >
                    <span role="img" aria-label={item.name}>{item.icon}</span>
                    {item.name}
                  </Link>

                  {/* Desktop Dropdown Menu */}
                  {showDropdown === item.name && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      padding: "10px",
                      minWidth: "200px",
                      zIndex: 1001
                    }}>
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          state={{ childId: child?._id }}
                          style={{
                            display: "block",
                            padding: "8px 12px",
                            textDecoration: "none",
                            color: "#333",
                            borderRadius: "4px",
                            margin: "5px 0",
                            transition: "background-color 0.2s",
                            backgroundColor: "transparent"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* User Profile and Logout */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "15px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #0066CC"
                }}>
                  <img
                    src={child?.avatar || "/assets/default-avatar.png"}
                    alt="User Avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
                <span style={{
                  fontWeight: "bold",
                  color: "#333",
                  fontSize: windowWidth < 1024 ? "14px" : "16px"
                }}>
                  {child?.name || "User"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "#FF6B6B",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: windowWidth < 1024 ? "6px 12px" : "8px 16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "background-color 0.3s",
                  fontFamily: "inherit",
                  fontSize: windowWidth < 1024 ? "14px" : "16px"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#FF4040"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#FF6B6B"}
              >
                <span role="img" aria-label="logout">🚪</span>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {windowWidth <= 768 && isMobileMenuOpen && (
        <div style={{
          backgroundColor: "#87CEEB",
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          padding: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          zIndex: 999
        }}>
          {/* Mobile Menu Items */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            {menuItems.map((item) => (
              <div key={item.name}>
                <div 
                  onClick={() => toggleMobileDropdown(item.name)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: showDropdown === item.name ? "rgba(255, 255, 255, 0.3)" : "transparent",
                    cursor: "pointer"
                  }}
                >
                  <Link
                    to={item.path}
                    state={{ childId: child?._id }}
                    style={{
                      textDecoration: "none",
                      color: "#333",
                      fontWeight: "bold",
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span role="img" aria-label={item.name}>{item.icon}</span>
                    {item.name}
                  </Link>
                  <span>{showDropdown === item.name ? "▲" : "▼"}</span>
                </div>

                {/* Mobile Dropdown */}
                {showDropdown === item.name && (
                  <div style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    marginLeft: "20px",
                    borderRadius: "8px",
                    padding: "5px",
                    marginTop: "5px"
                  }}>
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        state={{ childId: child?._id }}
                        style={{
                          display: "block",
                          padding: "10px",
                          textDecoration: "none",
                          color: "#333",
                          borderRadius: "4px"
                        }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile User Profile and Logout */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "10px",
              padding: "10px",
              borderTop: "1px solid rgba(255, 255, 255, 0.3)"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #0066CC"
                }}>
                  <img
                    src={child?.avatar || "/assets/default-avatar.png"}
                    alt="User Avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
                <span style={{
                  fontWeight: "bold",
                  color: "#333"
                }}>
                  {child?.name || "User"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "#FF6B6B",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "background-color 0.3s",
                  fontFamily: "inherit"
                }}
              >
                <span role="img" aria-label="logout">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;