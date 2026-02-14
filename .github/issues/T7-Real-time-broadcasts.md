Title: T7 — Add WebSocket real-time broadcasts

Description:
Implement WebSocket support to broadcast sheet updates and executed moves to session participants. Use Socket.IO or `ws` depending on preference.

Tasks:
- Add WebSocket server and channel/subscription model (sessions by campaign)
- Broadcast `move:executed`, `sheet:updated` events to connected clients
- Implement client-side subscription and handlers

Acceptance Criteria:
- Multiple clients connected to the same session receive `move:executed` broadcasts in under 1s
- Tests show broadcast arrival for simulated clients

Estimate: 1-2 days
Labels: backend, realtime, 2d
Depends on: T2, T5
Assignees: @TODO

Notes:
- Consider Socket.IO for easier room management and reconnection handling.