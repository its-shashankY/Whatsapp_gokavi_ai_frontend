import { Icon } from "@/components/ui/Icon";

export function LabUploadCard() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 card-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="upload_file" className="text-tertiary" />
        <h3 className="font-headline-md text-headline-md text-base text-on-surface">Upload Lab Report</h3>
      </div>
      <div className="border-2 border-dashed border-outline-variant rounded-lg p-8 flex flex-col items-center justify-center text-center bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
        <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
          <Icon name="cloud_upload" className="text-on-tertiary-fixed" />
        </div>
        <p className="font-button text-button text-primary mb-1">Click or drag file to this area</p>
        <p className="font-body-md text-body-md text-sm text-on-surface-variant">
          Supported formats: PDF, HL7, DICOM (Max 50MB)
        </p>
      </div>
      <div className="mt-4">
        <label className="block font-label-caps text-label-caps text-primary mb-2">DOCUMENT TYPE</label>
        <select className="w-full bg-surface-bright border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-lg p-2 font-body-md text-body-md text-sm">
          <option>Hormone Panel (FSH/LH/E2)</option>
          <option>Semen Analysis</option>
          <option>Ultrasound Scan</option>
          <option>Genetic Screening</option>
        </select>
      </div>
    </div>
  );
}
