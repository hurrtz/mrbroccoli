import React from "react";
import { ConversationMemoryModal } from "mrbroccoli";

// ConversationMemoryModal renders a real RN <Modal> (raw react-native) whose
// backdrop and centered card both paint real theme colors, so it needs no
// extra canvas wrapper — but like ConversationDrawer it needs
// {"cardMode":"single","viewport":"..."} to capture correctly as a
// full-viewport overlay rather than a clipped card (see learnings). Authored
// open regardless, per the brief.

export const WithSummary = () => (
  <ConversationMemoryModal
    visible
    title="Weekend trip to Lisbon"
    summarizedMessageCount={14}
    summary="You are planning a long weekend in Lisbon starting the fourteenth. You already picked a hotel near Alfama and asked me to compare morning flight times from two airports. You still want restaurant recommendations near the hotel and a rough three-day walking itinerary."
    onCopy={() => {}}
    onClear={() => {}}
    onSave={async () => true}
    onClose={() => {}}
  />
);

export const EmptySummary = () => (
  <ConversationMemoryModal
    visible
    title="New conversation"
    summary=""
    summarizedMessageCount={0}
    onCopy={() => {}}
    onClear={() => {}}
    onSave={async () => true}
    onClose={() => {}}
  />
);

export const LongSummary = () => (
  <ConversationMemoryModal
    visible
    title="Quarterly travel planning marathon"
    summarizedMessageCount={46}
    summary="You are coordinating a two-week trip across three cities for the finance offsite. Flights into the first city are booked for the morning of the ninth. The first hotel is confirmed, but the other two are still on hold pending budget sign-off. You want three restaurant options per city for the team dinners, and a packing list for one formal dinner plus casual, warm weather otherwise."
    onCopy={() => {}}
    onClear={() => {}}
    onSave={async () => true}
    onClose={() => {}}
  />
);
