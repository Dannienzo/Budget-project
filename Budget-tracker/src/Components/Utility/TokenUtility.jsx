import React from 'react'

export function getTokenExp(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp; // seconds since epoch
  } catch (e) {
    console.error("Invalid JWT token:", e);
    return null;
  }
}
