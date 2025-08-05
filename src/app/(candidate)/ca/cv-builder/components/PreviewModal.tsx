import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { X, Download, Save, ZoomIn, ZoomOut, FileText } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onDownload: () => void;
  children: React.ReactNode;
  title?: string;
}

interface BlockInfo {
  element: HTMLElement;
  top: number;
  bottom: number;
  height: number;
  type: string;
  page: number;
}

const PreviewModal = ({
  isOpen,
  onClose,
  onSave,
  onDownload,
  children,
  title = 'CV Preview',
}: PreviewModalProps) => {
  const [scale, setScale] = useState(0.8);
  const [pageCount, setPageCount] = useState(1);
  const [blockMapping, setBlockMapping] = useState<BlockInfo[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const PAGE_HEIGHT = 1188;
  const PADDING = 32;
  const USABLE_HEIGHT = PAGE_HEIGHT - PADDING * 2;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  // Smart page break calculation
  const calculateSmartPageBreaks = useCallback(() => {
    if (!measureRef.current) return;

    const container = measureRef.current;
    const containerRect = container.getBoundingClientRect();

    // Selectors for blocks that should not be split
    const blockSelectors = [
      '.experience-block',
      '.education-block',
      '.certification-block',
      '.skill-block',
      'section',
    ];

    const blocks: BlockInfo[] = [];
    let maxPage = 0;

    // Process each type of block
    blockSelectors.forEach((selector) => {
      const elements = container.querySelectorAll(selector);

      elements.forEach((element) => {
        const el = element as HTMLElement;
        const rect = el.getBoundingClientRect();
        const relativeTop = rect.top - containerRect.top;
        const relativeBottom = relativeTop + rect.height;

        // Determine which page this block should be on
        let blockPage = Math.floor(relativeTop / USABLE_HEIGHT);

        // Check if block spans multiple pages
        const blockEndPage = Math.floor(relativeBottom / USABLE_HEIGHT);

        // If block spans pages, move it to the next page if there's room
        if (blockPage !== blockEndPage) {
          const spaceOnCurrentPage =
            (blockPage + 1) * USABLE_HEIGHT - relativeTop;
          // const spaceNeededOnNextPage = rect.height;

          // If less than 20% of block fits on current page, move to next
          if (spaceOnCurrentPage < rect.height * 0.2) {
            blockPage = blockEndPage;
          }
        }

        blocks.push({
          element: el,
          top: relativeTop,
          bottom: relativeBottom,
          height: rect.height,
          type: selector,
          page: blockPage,
        });

        maxPage = Math.max(maxPage, blockPage);
      });
    });

    setBlockMapping(blocks);
    setPageCount(maxPage + 1);
  }, [USABLE_HEIGHT]);

  // Apply visibility based on page
  const applyBlockVisibility = useCallback(
    (pageIndex: number) => {
      if (!contentRef.current) return;

      const pageContainers =
        contentRef.current.querySelectorAll('.cv-preview-page');
      const pageContainer = pageContainers[pageIndex];

      if (!pageContainer) return;

      // Reset all blocks to hidden initially
      blockMapping.forEach((block) => {
        const elements = pageContainer.querySelectorAll(block.type);
        elements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          const rect = el.getBoundingClientRect();
          const containerRect = pageContainer.getBoundingClientRect();
          const relativeTop =
            rect.top - containerRect.top + pageIndex * USABLE_HEIGHT;

          // Check if this is the same element by position
          if (Math.abs(relativeTop - block.top) < 5) {
            if (block.page === pageIndex) {
              htmlEl.style.opacity = '1';
              htmlEl.style.visibility = 'visible';
            } else {
              htmlEl.style.opacity = '0';
              htmlEl.style.visibility = 'hidden';
            }
          }
        });
      });
    },
    [blockMapping, USABLE_HEIGHT],
  );

  // Effect to calculate page breaks when modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(0.8);
      // Wait for content to render then calculate
      const timers = [
        setTimeout(calculateSmartPageBreaks, 100),
        setTimeout(calculateSmartPageBreaks, 300),
        setTimeout(calculateSmartPageBreaks, 500),
      ];

      return () => timers.forEach(clearTimeout);
    }
  }, [isOpen, children, calculateSmartPageBreaks]);

  // Apply visibility after pages are rendered
  useEffect(() => {
    if (blockMapping.length > 0 && contentRef.current) {
      for (let i = 0; i < pageCount; i++) {
        applyBlockVisibility(i);
      }
    }
  }, [blockMapping, pageCount, applyBlockVisibility]);

  return (
    <>
      <style>
        {`
          .cv-preview-page {
            width: 840px;
            height: 1188px;
            background: white;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            margin-bottom: 32px;
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
          }
          
          .cv-page-content {
            position: absolute;
            width: 100%;
            padding: 32px;
            box-sizing: border-box;
          }
          
          .cv-preview-page button {
            display: none !important;
          }
          
          .cv-preview-page * {
            max-width: 100%;
          }
          
          .debug-info {
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
          }
          
          /* Ensure blocks maintain their layout even when hidden */
          .experience-block,
          .education-block,
          .certification-block,
          .skill-block,
          section {
            transition: opacity 0.2s ease;
          }
        `}
      </style>

      <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
          <DialogPrimitive.Content
            className="fixed inset-4 z-50 flex flex-col rounded-lg bg-white shadow-lg"
            style={{
              margin: '20px',
              width: 'calc(100vw - 40px)',
              height: 'calc(100vh - 40px)',
              maxWidth: 'none',
              maxHeight: 'none',
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{title}</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    title="Thu nhỏ"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[60px] text-center text-sm text-gray-600">
                    {Math.round(scale * 100)}%
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    title="Phóng to"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <DialogPrimitive.Close asChild>
                    <Button variant="ghost" size="icon" className="ml-4">
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogPrimitive.Close>
                </div>
              </div>
            </div>

            {/* Content with pages */}
            <div className="flex-1 overflow-auto bg-gray-200 p-8">
              {/* Hidden div for measuring */}
              <div
                ref={measureRef}
                className="cv-measure-content"
                style={{
                  position: 'absolute',
                  width: '840px',
                  padding: '32px',
                  visibility: 'hidden',
                  left: '-9999px',
                  boxSizing: 'border-box',
                }}
              >
                {children}
              </div>

              {/* Visible pages */}
              <div className="flex flex-col items-center">
                <div
                  ref={contentRef}
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease-in-out',
                  }}
                >
                  {Array.from({ length: pageCount }, (_, pageIndex) => (
                    <div key={pageIndex} className="cv-preview-page">
                      <div
                        className="cv-page-content"
                        style={{
                          top: -pageIndex * USABLE_HEIGHT + 'px',
                        }}
                      >
                        {children}
                      </div>

                      {/* Page number */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '12px',
                          color: '#666',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <FileText size={14} />
                        Trang {pageIndex + 1} / {pageCount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t bg-white px-6 py-4">
              <div className="flex w-full items-center justify-between">
                <p className="text-sm text-gray-600">
                  Kiểm tra kỹ CV của bạn trước khi lưu hoặc tải xuống • Tổng số:{' '}
                  {pageCount} trang
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose}>
                    Đóng
                  </Button>
                  <Button
                    variant="default"
                    onClick={onSave}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Lưu vào hệ thống
                  </Button>
                  <Button
                    variant="default"
                    onClick={onDownload}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Tải xuống PDF
                  </Button>
                </div>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
};

export default PreviewModal;
