// components/QRCodeGenerator.tsx
import {QRCodeSVG} from "qrcode.react";

interface QRCodeGeneratorProps {
  value: string;              // Text to encode in QR
  size?: number;              // Size in pixels
  bgColor?: string;           // Background color
  fgColor?: string;           // Foreground (QR) color
  includeMargin?: boolean;    // Add white margin around QR
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 128,
  bgColor = "#ffffff",
  fgColor = "#000000",
  includeMargin = false,
}) => {
  return (
    <div className="p-2 inline-block">
      <QRCodeSVG
        value={value}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        includeMargin={includeMargin}
      />
    </div>
  );
};

export default QRCodeGenerator;