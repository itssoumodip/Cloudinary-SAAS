"use client";

import React, {useEffect, useState, useRef} from 'react'
import { CldImage } from 'next-cloudinary';

const socialFormats = {
    "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1"},
    "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5"},
    "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9"},
    "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1"},
    "Facebook Cover (16:9)": { width: 820, height: 312, aspectRatio: "16:9"},
};

type SocialFormat = keyof typeof socialFormats;

const SocialShare = () => {
  return (
    <div>SocialShare</div>
  )
}

export default SocialShare