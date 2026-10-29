import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import type { CrmRoutePageProps } from "../CrmLayout";
import { searchMapTileConfig } from "../../search/searchMapData";
import {
  getCityIdFromUrl,
  getSelectedNeighborhoodIdFromUrl,
} from "../location-map/urlAndRecordHelpers";
import { useCrmLocationMapData } from "../location-map/useCrmLocationMapData";
import { useCrmLocationMapEditor } from "../location-map/useCrmLocationMapEditor";
import { CrmLocationMapEmptyState } from "../location-map/components/CrmLocationMapEmptyState";
import { CrmLocationMapSidebar } from "../location-map/components/CrmLocationMapSidebar";
import { MapViewport, MapResizeOnFullscreen } from "../location-map/components/MapViewport";
import { BoundaryDrawCollector } from "../location-map/components/BoundaryDrawCollector";
import { MapBoundariesLayer } from "../location-map/components/MapBoundariesLayer";
import { MapEditorOverlayLayers } from "../location-map/components/MapEditorOverlayLayers";
import { CrmLocationMapFloatingControls } from "../location-map/components/CrmLocationMapFloatingControls";

export function CrmLocationMapPage({ notify, refreshNonce }: CrmRoutePageProps) {
  const cityId = getCityIdFromUrl();
  const initialNeighborhoodId = getSelectedNeighborhoodIdFromUrl();
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  const data = useCrmLocationMapData({ cityId, refreshNonce });

  const editor = useCrmLocationMapEditor({
    boundaries: data.boundaries,
    cityCenter: data.cityCenter,
    cityId,
    initialNeighborhoodId,
    neighborhoods: data.neighborhoods,
    notify,
  });

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await workspaceRef.current?.requestFullscreen();
      }
    } catch {
      notify("مرورگر اجازه نمایش تمام‌صفحه را نداد.", "error");
    }
  };

  if (!cityId) {
    return <CrmLocationMapEmptyState />;
  }

  return (
    <div
      ref={workspaceRef}
      className="relative h-full min-h-[620px] overflow-hidden rounded-xl bg-white"
      dir="rtl"
    >
      <div className="grid h-full min-h-0 grid-cols-[360px_minmax(0,1fr)] overflow-hidden">
        <CrmLocationMapSidebar
          cityName={data.cityName}
          draftName={editor.draftName}
          expandedNeighborhoodId={editor.expandedNeighborhoodId}
          isError={data.isError}
          isLoading={data.isLoading}
          isPending={editor.mutations.isPending}
          neighborhoods={data.neighborhoods}
          newSubName={editor.newSubName}
          onChangeDraftName={editor.setDraftName}
          onChangeNewSubName={editor.setNewSubName}
          onDeleteSubNeighborhood={(subId, name) => {
            if (!window.confirm(`زیرمحله «${name}» حذف شود؟`)) return;
            void editor.deleteSubNeighborhood(subId);
          }}
          onOpenNewSubInput={(neighborhoodId) => {
            editor.setSelectedNeighborhoodId(neighborhoodId);
            editor.setSelectedSubId("");
            editor.setExpandedNeighborhoodId(neighborhoodId);
            editor.setNewSubName("");
            editor.setShowNewSubInputFor(neighborhoodId);
          }}
          onRefetch={data.refetch}
          onSelectSubNeighborhood={(neighborhoodId, subId) => {
            editor.setSelectedNeighborhoodId(neighborhoodId);
            editor.setSelectedSubId(subId);
          }}
          onStartNeighborhoodBoundary={editor.startNeighborhoodBoundary}
          onStartNewNeighborhood={editor.startNewNeighborhood}
          onStartNewSubNeighborhood={editor.startNewSubNeighborhood}
          onStartSubNeighborhoodBoundary={editor.startSubNeighborhoodBoundary}
          onToggleExpand={(neighborhoodId) => {
            const willOpen = editor.expandedNeighborhoodId !== neighborhoodId;
            editor.setSelectedNeighborhoodId(neighborhoodId);
            editor.setSelectedSubId("");
            editor.setExpandedNeighborhoodId(willOpen ? neighborhoodId : "");
            editor.setShowNewSubInputFor("");
            editor.setNewSubName("");
          }}
          onToggleNewNeighborhoodInput={() => {
            editor.resetEditor();
            editor.setDraftName("");
            editor.setShowNewNeighborhoodInput((current) => !current);
          }}
          selectedNeighborhoodId={editor.selectedNeighborhoodId}
          selectedSubId={editor.selectedSubId}
          showNewNeighborhoodInput={editor.showNewNeighborhoodInput}
          showNewSubInputFor={editor.showNewSubInputFor}
        />

        <section className="relative min-h-0 min-w-0 overflow-hidden bg-[#eef1f5]">
          <MapContainer center={data.cityCenter} className="h-full w-full" scrollWheelZoom zoom={13}>
            <TileLayer
              attribution={searchMapTileConfig.attribution}
              className={searchMapTileConfig.className}
              maxZoom={searchMapTileConfig.maxZoom}
              tms={searchMapTileConfig.isTms}
              url={searchMapTileConfig.urlTemplate}
            />
            <MapViewport center={data.cityCenter} points={data.allBoundaryPoints} />
            <MapResizeOnFullscreen fullscreen={isFullscreen} />
            <BoundaryDrawCollector
              enabled={
                Boolean(editor.editTarget) &&
                (editor.draftPoints.length < 3 ||
                  editor.editTarget?.kind === "new-neighborhood" ||
                  (editor.editTarget?.kind === "sub-neighborhood" && editor.editTarget.isNew))
              }
              onAdd={editor.addDraftPoint}
            />
            <MapBoundariesLayer
              activeBoundaryId={editor.activeBoundaryId}
              boundaries={data.boundaries}
              editTarget={editor.editTarget}
              onSelectBoundary={(neighborhoodId, subId) => {
                editor.setSelectedNeighborhoodId(neighborhoodId);
                editor.setExpandedNeighborhoodId(neighborhoodId);
                editor.setSelectedSubId(subId);
              }}
              selectedNeighborhoodId={editor.selectedNeighborhoodId}
              selectedSubId={editor.selectedSubId}
            />
            <MapEditorOverlayLayers
              boundaries={editor.snapBoundaries}
              draftPoints={editor.draftPoints}
              editTarget={editor.editTarget}
              onAddExactPoint={editor.addExactDraftPoint}
              onInsertMidpoint={editor.insertDraftPointAfter}
              onMoveVertex={editor.moveDraftPoint}
              onPreviewMoveVertex={editor.previewDraftPointMove}
              onSelectVertexIndex={editor.setSelectedDraftPointIndex}
              selectedDraftPointIndex={editor.selectedDraftPointIndex}
              snapBoundaries={editor.snapBoundaries}
            />
          </MapContainer>

          <CrmLocationMapFloatingControls
            editTarget={editor.editTarget}
            isFullscreen={isFullscreen}
            isPending={editor.mutations.isPending}
            isSavePending={editor.mutations.isSavePending}
            lastSnapNotice={editor.lastSnapNotice}
            onCancel={editor.cancelActiveBoundary}
            onRemoveDraftPoint={editor.removeDraftPoint}
            onSave={() => void editor.saveActiveBoundary()}
            onToggleFullscreen={toggleFullscreen}
            selectedDraftPointIndex={editor.selectedDraftPointIndex}
          />
        </section>
      </div>
    </div>
  );
}
