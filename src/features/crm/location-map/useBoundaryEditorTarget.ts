import { useState } from "react";
import type { LatLngTuple } from "leaflet";
import type { CrmRecord } from "../api/crm.service";
import { getCrmRecordId } from "../api/crm.service";
import { readText } from "../CrmLayout";
import { getNeighborhoodPoints, getSubNeighborhoodPoints } from "./geometry";
import {
  createLocalSubNeighborhoodId,
  parseSubNeighborhoods,
} from "./urlAndRecordHelpers";
import type { EditTarget, SubNeighborhoodRecord } from "./types";

export function useBoundaryEditorTarget({
  neighborhoods,
  notify,
  setExpandedNeighborhoodId,
  setSelectedNeighborhoodId,
  setSelectedSubId,
}: {
  neighborhoods: CrmRecord[];
  notify: (message: string, tone?: "error" | "success") => void;
  setExpandedNeighborhoodId: (id: string) => void;
  setSelectedNeighborhoodId: (id: string) => void;
  setSelectedSubId: (id: string) => void;
}) {
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [draftPoints, setDraftPoints] = useState<LatLngTuple[]>([]);
  const [draftName, setDraftName] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [showNewSubInputFor, setShowNewSubInputFor] = useState("");
  const [showNewNeighborhoodInput, setShowNewNeighborhoodInput] = useState(false);
  const [lastSnapNotice, setLastSnapNotice] = useState(false);
  const [selectedDraftPointIndex, setSelectedDraftPointIndex] = useState<number | null>(null);

  const resetEditor = () => {
    setEditTarget(null);
    setDraftPoints([]);
    setDraftName("");
    setLastSnapNotice(false);
    setSelectedDraftPointIndex(null);
  };

  const cancelActiveBoundary = () => {
    if (editTarget?.kind === "sub-neighborhood" && editTarget.isNew) {
      setSelectedNeighborhoodId(editTarget.neighborhoodId);
      setSelectedSubId("");
      setExpandedNeighborhoodId(editTarget.neighborhoodId);
    }
    resetEditor();
  };

  const startNeighborhoodBoundary = (neighborhood: CrmRecord) => {
    const neighborhoodId = getCrmRecordId(neighborhood);
    setSelectedNeighborhoodId(neighborhoodId);
    setSelectedSubId("");
    setExpandedNeighborhoodId(neighborhoodId);
    setEditTarget({ kind: "neighborhood", neighborhoodId });
    setDraftName(readText(neighborhood, ["name"], ""));
    setDraftPoints(getNeighborhoodPoints(neighborhood));
    setSelectedDraftPointIndex(null);
  };

  const startNewNeighborhood = () => {
    const name = draftName.trim();
    if (!name) {
      notify("ابتدا نام محله جدید را وارد کنید.", "error");
      return;
    }
    if (neighborhoods.some((item) => readText(item, ["name"], "").trim() === name)) {
      notify("محله‌ای با این نام در همین شهر وجود دارد.", "error");
      return;
    }
    setSelectedNeighborhoodId("");
    setSelectedSubId("");
    setEditTarget({ kind: "new-neighborhood" });
    setDraftPoints([]);
    setSelectedDraftPointIndex(null);
    setShowNewNeighborhoodInput(false);
  };

  const startSubNeighborhoodBoundary = (
    neighborhood: CrmRecord,
    subNeighborhood: SubNeighborhoodRecord,
  ) => {
    const neighborhoodId = getCrmRecordId(neighborhood);
    setSelectedNeighborhoodId(neighborhoodId);
    setSelectedSubId(subNeighborhood.id);
    setExpandedNeighborhoodId(neighborhoodId);
    setEditTarget({
      isNew: false,
      kind: "sub-neighborhood",
      neighborhoodId,
      subId: subNeighborhood.id,
    });
    setDraftName(subNeighborhood.name);
    setDraftPoints(getSubNeighborhoodPoints(subNeighborhood));
    setSelectedDraftPointIndex(null);
  };

  const startNewSubNeighborhood = (neighborhood: CrmRecord) => {
    const name = newSubName.trim();
    if (!name) {
      notify("نام زیرمحله را وارد کنید.", "error");
      return;
    }
    const neighborhoodId = getCrmRecordId(neighborhood);
    if (getNeighborhoodPoints(neighborhood).length < 3) {
      notify("ابتدا محدوده محله اصلی را ترسیم و ذخیره کنید.", "error");
      return;
    }
    const duplicateOwner = neighborhoods.find((item) =>
      parseSubNeighborhoods(item.sub_neighbors).some((sub) => sub.name.trim() === name),
    );
    if (duplicateOwner) {
      notify(
        `زیرمحله «${name}» قبلاً زیر محله «${readText(duplicateOwner, ["name"], "")}» ثبت شده است.`,
        "error",
      );
      return;
    }
    const subId = createLocalSubNeighborhoodId();
    setSelectedNeighborhoodId(neighborhoodId);
    setSelectedSubId(subId);
    setEditTarget({ isNew: true, kind: "sub-neighborhood", neighborhoodId, subId });
    setDraftName(name);
    setDraftPoints([]);
    setSelectedDraftPointIndex(null);
    setNewSubName("");
    setShowNewSubInputFor("");
  };

  return {
    cancelActiveBoundary,
    draftName,
    draftPoints,
    editTarget,
    lastSnapNotice,
    newSubName,
    resetEditor,
    selectedDraftPointIndex,
    setDraftName,
    setDraftPoints,
    setEditTarget,
    setLastSnapNotice,
    setNewSubName,
    setSelectedDraftPointIndex,
    setShowNewNeighborhoodInput,
    setShowNewSubInputFor,
    showNewNeighborhoodInput,
    showNewSubInputFor,
    startNeighborhoodBoundary,
    startNewNeighborhood,
    startNewSubNeighborhood,
    startSubNeighborhoodBoundary,
  };
}
