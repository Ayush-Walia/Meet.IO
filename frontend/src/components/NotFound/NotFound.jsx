import React from 'react'
import { Image } from 'antd';
import NotFoundImage from '../../assets/404.svg';

export default function NotFound() {
    return (
        <Image
            src={NotFoundImage}
            height="80%"
            width="80%"
            preview={false}
        />
    )
}
