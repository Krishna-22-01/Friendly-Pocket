import "./index.css";
import "./App.css"

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Camera } from "lucide-react";

export default function FriendlyPocketDemo() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState(0);
  const [conversionRate, setConversionRate] = useState(10);
  const [points, setPoints] = useState(0);
  const [payment, setPayment] = useState(0);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    let script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/instascan/1.0.0/instascan.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const convertToPoints = () => {
    setPoints(amount * conversionRate);
    setStep(4);
  };

  const startScanner = async () => {
    if (!window.Instascan) {
      alert("Instascan is not loaded yet. Please wait.");
      return;
    }

    setScanning(true);
    scannerRef.current = new window.Instascan.Scanner({
      video: videoRef.current,
    });
    scannerRef.current.addListener("scan", (content) => {
      alert(`QR Code Scanned: ${content}\nPayment Successful!`);
      setScanning(false);
      setStep(6);
      scannerRef.current.stop();
    });

    const cameras = await window.Instascan.Camera.getCameras();
    if (cameras.length > 0) {
      scannerRef.current.start(cameras[0]);
    } else {
      alert("No cameras found");
      setScanning(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4 border rounded-xl shadow-md">
      {step === 1 && (
        <div>
          <h1 className="text-xl font-bold">Welcome to Friendly Pocket</h1>
          <Button className="mt-4" onClick={() => setStep(2)}>
            Proceed to Login
          </Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="text-xl font-bold">Login</h1>
          <Input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button className="mt-4" onClick={() => setStep(3)}>
            Login
          </Button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h1 className="text-xl font-bold">Currency Conversion</h1>
          <label>Set Conversion Rate (1 Unit = ? Points):</label>
          <Input
            type="number"
            value={conversionRate}
            onChange={(e) => setConversionRate(Number(e.target.value))}
          />
          <label>Enter Amount:</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <Button className="mt-2" onClick={convertToPoints}>
            Convert to Points
          </Button>
        </div>
      )}

      {step === 4 && (
        <div>
          <h1 className="text-xl font-bold">Make a Payment</h1>
          <p>Total Points: {points}</p>
          <label>Adjust Payment:</label>
          <Slider
            defaultValue={[0]}
            max={points}
            step={1}
            onValueChange={(value) => setPayment(value[0])}
          />
          <p>Selected Payment: {payment} Points</p>
          <Button className="mt-4" onClick={() => setStep(5)}>
            Proceed to QR Scan
          </Button>
        </div>
      )}

      {step === 5 && (
        <div>
          <h1 className="text-xl font-bold">Scan QR Code to Pay</h1>
          <Button className="flex items-center gap-2" onClick={startScanner}>
            <Camera size={18} /> Scan QR & Pay
          </Button>
          {scanning && (
            <div className="mt-4 border rounded-lg overflow-hidden">
              <video ref={videoRef} className="w-full" autoPlay playsInline />
            </div>
          )}
        </div>
      )}

      {step === 6 && (
        <div>
          <h1 className="text-xl font-bold">Payment Successful!</h1>
          <p>Thank you for using Friendly Pocket, {username}!</p>
          <Button className="mt-4" onClick={() => setStep(1)}>
            Restart
          </Button>
        </div>
      )}
    </div>
  );
}
