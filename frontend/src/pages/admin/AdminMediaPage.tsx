import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useMedia } from '@/hooks/useMedia';
import { uploadMedia, updateMedia, deleteMedia, type MediaGalleryFields } from '@/services/mediaService';
import type { MediaAssetDto } from '@/types/media';
import type { GallerySection } from '@/types/gallery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import type { CustomCellRendererProps } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { AdminDataGrid } from '@/components/admin/AdminDataGrid';
import type { RowAction } from '@/components/admin/RowActionsCell';

function formatSize(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function galleryLabel(item: MediaAssetDto): string {
  if (!item.showInGallery) return '—';
  if (item.section === 'EVENT') return `Event${item.eventName ? `: ${item.eventName}` : ''}`;
  return 'Website';
}

export default function AdminMediaPage() {
  const queryClient = useQueryClient();
  const { data: assets, isLoading } = useMedia();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['media'] });

  const [uploadOpen, setUploadOpen] = useState(false);
  const [editItem, setEditItem] = useState<MediaAssetDto | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaAssetDto | null>(null);

  // shared form fields (upload + edit)
  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState('');
  const [showInGallery, setShowInGallery] = useState(false);
  const [section, setSection] = useState<GallerySection>('WEBSITE');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [busy, setBusy] = useState(false);

  const resetForm = () => {
    setFile(null); setLabel(''); setShowInGallery(false);
    setSection('WEBSITE'); setEventName(''); setEventDate('');
  };
  const openUpload = () => { resetForm(); setUploadOpen(true); };
  const openEdit = (item: MediaAssetDto) => {
    setFile(null);
    setLabel(item.label ?? '');
    setShowInGallery(item.showInGallery);
    setSection(item.section ?? 'WEBSITE');
    setEventName(item.eventName ?? '');
    setEventDate(item.eventDate ?? '');
    setEditItem(item);
  };

  const galleryFields = (): MediaGalleryFields => ({
    showInGallery,
    section: showInGallery ? section : undefined,
    eventName: showInGallery && section === 'EVENT' ? eventName || undefined : undefined,
    eventDate: showInGallery && section === 'EVENT' ? eventDate || undefined : undefined,
  });

  const submitUpload = async () => {
    if (!file) { toast.error('Choose an image first'); return; }
    setBusy(true);
    try {
      await uploadMedia({ file, label: label || undefined, ...galleryFields() });
      toast.success('Image uploaded');
      setUploadOpen(false);
      refresh();
    } catch { toast.error('Upload failed'); } finally { setBusy(false); }
  };

  const submitEdit = async () => {
    if (!editItem) return;
    setBusy(true);
    try {
      await updateMedia(editItem.id, { file: file ?? undefined, label, ...galleryFields() });
      toast.success('Image updated');
      setEditItem(null);
      refresh();
    } catch { toast.error('Update failed'); } finally { setBusy(false); }
  };

  const onCopy = async (item: MediaAssetDto) => {
    // Copy the full absolute URL (origin + path) so it pastes as a complete, clickable link.
    const fullUrl = item.url.startsWith('http') ? item.url : window.location.origin + item.url;
    try { await navigator.clipboard.writeText(fullUrl); toast.success('Link copied'); }
    catch { toast.error('Could not copy'); }
  };

  const onDelete = async (item: MediaAssetDto) => {
    if (!window.confirm('Delete this image?')) return;
    try { await deleteMedia(item.id); toast.success('Deleted'); refresh(); }
    catch { toast.error('Delete failed'); }
  };

  // Shared gallery-publishing controls for both dialogs.
  const galleryControls = (
    <div className="space-y-3 rounded-md border p-3">
      <div className="flex items-center gap-2">
        <Checkbox id="show-gallery" checked={showInGallery} data-testid="media-show-gallery"
                  onCheckedChange={(v) => setShowInGallery(v === true)} />
        <Label htmlFor="show-gallery">Show in public gallery</Label>
      </div>
      {showInGallery && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Section</Label>
            <Select value={section} onValueChange={(v) => setSection(v as GallerySection)}>
              <SelectTrigger data-testid="media-section-select"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="WEBSITE">Website gallery</SelectItem>
                <SelectItem value="EVENT">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {section === 'EVENT' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="ev-name">Event name</Label>
                <Input id="ev-name" value={eventName} data-testid="media-event-name"
                       onChange={(e) => setEventName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ev-date">Event date</Label>
                <Input id="ev-date" type="date" value={eventDate} data-testid="media-event-date"
                       onChange={(e) => setEventDate(e.target.value)} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const mediaColumnDefs: ColDef<MediaAssetDto>[] = [
    {
      headerName: 'Preview',
      field: 'url',
      sortable: false,
      filter: false,
      width: 90,
      flex: 0,
      cellRenderer: (p: CustomCellRendererProps<MediaAssetDto>) => (
        <img src={p.data?.url} alt={p.data?.label ?? ''} className="h-10 w-10 rounded object-cover" />
      ),
    },
    { headerName: 'Name / label', valueGetter: (p) => p.data?.label || p.data?.filename || `#${p.data?.id}` },
    { headerName: 'In gallery', valueGetter: (p) => (p.data ? galleryLabel(p.data) : '') },
    { headerName: 'Type', field: 'contentType' },
    { headerName: 'Size', valueGetter: (p) => formatSize(p.data?.sizeBytes ?? null), width: 110, flex: 0 },
    {
      headerName: 'Uploaded',
      field: 'uploadedAt',
      valueFormatter: (p) => (p.value ? new Date(p.value).toLocaleDateString() : ''),
    },
  ];

  const mediaActions: RowAction<MediaAssetDto>[] = [
    { label: 'Copy link', onClick: onCopy },
    { label: 'Preview', onClick: (item) => setPreviewItem(item) },
    { label: 'Update', onClick: openEdit },
    { label: 'Delete', onClick: onDelete, danger: true },
  ];

  return (
    <div className="space-y-6" data-testid="admin-media-page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Media library</h1>
        <Button onClick={openUpload} data-testid="media-upload-open">Upload image</Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Upload once, then copy an image's link to use it anywhere (e.g. a trainer's photo), or tick
        "Show in public gallery" to publish it. <span data-testid="media-count">{assets?.length ?? 0} image(s).</span>
      </p>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (assets?.length ?? 0) === 0 ? (
        <p className="text-muted-foreground" data-testid="media-empty">No images yet.</p>
      ) : (
        <AdminDataGrid<MediaAssetDto>
          testId="media-table"
          rowData={assets!}
          rowHeight={56}
          columnDefs={mediaColumnDefs}
          actions={mediaActions}
          emptyMessage="No images yet."
        />
      )}

      {/* Upload dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent data-testid="media-upload-dialog">
          <DialogHeader>
            <DialogTitle>Upload image</DialogTitle>
            <DialogDescription>Add an image to the media library.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="up-file">Image file</Label>
              <Input id="up-file" type="file" accept="image/*" data-testid="media-file"
                     onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="up-label">Label</Label>
              <Input id="up-label" value={label} data-testid="media-label"
                     onChange={(e) => setLabel(e.target.value)} placeholder="Optional" />
            </div>
            {galleryControls}
          </div>
          <DialogFooter>
            <Button onClick={submitUpload} disabled={busy} data-testid="media-upload-submit">
              {busy ? 'Uploading…' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={editItem !== null} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent data-testid="media-edit-dialog">
          <DialogHeader>
            <DialogTitle>Update image</DialogTitle>
            <DialogDescription>Replace the image and/or edit its details and gallery publishing.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {editItem && <img src={editItem.url} alt="" className="h-24 w-24 rounded object-cover" />}
            <div className="space-y-2">
              <Label htmlFor="ed-file">Replace file (optional)</Label>
              <Input id="ed-file" type="file" accept="image/*" data-testid="media-edit-file"
                     onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ed-label">Label</Label>
              <Input id="ed-label" value={label} data-testid="media-edit-label"
                     onChange={(e) => setLabel(e.target.value)} />
            </div>
            {galleryControls}
          </div>
          <DialogFooter>
            <Button onClick={submitEdit} disabled={busy} data-testid="media-edit-submit">
              {busy ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview dialog */}
      <Dialog open={previewItem !== null} onOpenChange={(o) => !o && setPreviewItem(null)}>
        <DialogContent data-testid="media-preview-dialog">
          <DialogHeader>
            <DialogTitle>{previewItem?.label || previewItem?.filename || 'Preview'}</DialogTitle>
          </DialogHeader>
          {previewItem && (
            <img src={previewItem.url} alt={previewItem.label ?? ''} data-testid="media-preview-img"
                 className="max-h-[70vh] w-full rounded object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
