import { type IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';

interface Props {
  onScan: (value: string) => void;
}

function QrScanner({ onScan }: Props) {
  const processScan = (result: IDetectedBarcode[]) => {
    if (result.length > 0) {
      onScan(result[0].rawValue);
    }
  };

  return (
    <>
      <Scanner onScan={processScan} onError={(error) => console.log(error?.message)} />
    </>
  );
}

export default QrScanner;
