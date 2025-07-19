import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';

const QRScannerComponent = ({ isOpen, onClose, onScan }) => {
  const [manualInput, setManualInput] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanningRef = useRef(false);

  useEffect(() => {
    console.log('🔥 useEffect çalışıyor - isOpen:', isOpen);
    if (isOpen) {
      // Video elementi render edilmesi için kısa bir gecikme
      setTimeout(() => {
        console.log('🔥 startCamera çağırılıyor (gecikme ile)...');
        startCamera();
      }, 100);
    }
    return () => {
      scanningRef.current = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      console.log('🎥 Kamera başlatılıyor...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      console.log('✅ Kamera stream alındı:', stream);
      streamRef.current = stream;
      console.log('🔍 videoRef.current:', videoRef.current);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('✅ Video element\'e stream atandı');
        setCameraActive(true);
        console.log('✅ setCameraActive(true) çağırıldı');
        scanningRef.current = true;
      } else {
        console.error('❌ videoRef.current null!');
      }
    } catch (err) {
      console.error('❌ Kamera hatası:', err);
      setCameraActive(false);
    }
  };

  const startQRScanning = () => {
    const scanQR = () => {
      if (!scanningRef.current || !videoRef.current || !cameraActive) return;
      
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (canvas.width > 0 && canvas.height > 0) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          console.log('🎯 QR Kod bulundu:', code.data);
          scanningRef.current = false;
          onScan(code.data);
          return;
        }
      }
      
      requestAnimationFrame(scanQR);
    };
    
    if (videoRef.current && videoRef.current.readyState >= 2) {
      scanQR();
    } else if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', scanQR, { once: true });
    }
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      console.log('✋ Manuel ID girişi:', manualInput.trim());
      onScan(manualInput.trim());
      setManualInput('');
      onClose();
    }
  };

  if (!isOpen) return null;

  console.log('🔥 QR Scanner Render - cameraActive:', cameraActive);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">QR Kod Tarayıcı</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {/* QR Scanner Area */}
        <div className="mb-4">
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '300px' }}>
            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center text-white">
                  <p className="text-lg">📷 Kamera açılıyor...</p>
                  <p className="text-sm mt-2 opacity-70">
                    Kamera izni gerekiyor
                  </p>
                </div>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${!cameraActive ? 'opacity-0' : 'opacity-100'}`}
              onLoadedMetadata={() => {
                console.log('✅ Video metadata yüklendi');
                if (scanningRef.current) {
                  startQRScanning();
                }
              }}
            />
            {cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-green-400 border-opacity-70 rounded-lg">
                  <div className="w-full h-full border-2 border-white border-dashed rounded-lg animate-pulse"></div>
                </div>
              </div>
            )}
            {cameraActive && (
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm text-center bg-black bg-opacity-50 p-2 rounded">
                  📷 QR kodunu yeşil kare içinde tutun
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Manual Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Manuel Rezervasyon ID
          </label>
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="ID girin"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleManualSubmit}
            disabled={!manualInput.trim()}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Gönder
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScannerComponent;
