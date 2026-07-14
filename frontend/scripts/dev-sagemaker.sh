#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export SAGEMAKER=1
export NEXT_PUBLIC_BASE_PATH="/codeeditor/default/absports/3000"

PIDFILE="/tmp/attendance-sagemaker.pids"

stop() {
  if [ -f "$PIDFILE" ]; then
    while read -r pid; do
      kill "$pid" 2>/dev/null || true
    done < "$PIDFILE"
    rm -f "$PIDFILE"
    echo "Stopped."
  else
    echo "No PID file found."
  fi
}

if [ "${1:-}" = "stop" ]; then
  stop
  exit 0
fi

# Stop any previous run
stop

# Build frontend with SageMaker settings
echo "Building frontend..."
npx next build

# Start backend (H2)
BACKEND_DIR="$(dirname "$0")/../../backend"
echo "Starting backend..."
"$BACKEND_DIR/gradlew" -p "$BACKEND_DIR" bootRun --args='--spring.profiles.active=local' > /tmp/backend-sagemaker.log 2>&1 &
echo $! > "$PIDFILE"

# Wait for backend
echo "Waiting for backend..."
for i in $(seq 1 30); do
  if curl -s http://localhost:8080/api/auth/login -X POST -H "Content-Type: application/json" -d '{"loginId":"x","password":"x"}' > /dev/null 2>&1; then
    break
  fi
  sleep 1
done
echo "Backend ready."

# Start Next.js (production mode)
echo "Starting frontend on :3001..."
npx next start -H 127.0.0.1 -p 3001 > /tmp/frontend-sagemaker.log 2>&1 &
echo $! >> "$PIDFILE"

# Start restoration proxy
echo "Starting proxy on :3000..."
node server.js > /tmp/proxy-sagemaker.log 2>&1 &
echo $! >> "$PIDFILE"

sleep 2
echo ""
echo "=== SageMaker Preview Ready ==="
echo "URL: https://<your-studio-domain>/codeeditor/default/absports/3000/"
echo ""
echo "To stop: npm run dev:sagemaker:stop"
