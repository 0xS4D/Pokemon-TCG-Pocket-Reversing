import asyncio
import socketio
import frida
from aiohttp import web

sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode='aiohttp') 
app = web.Application()
sio.attach(app)

loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)

async def broadcast_message(data):
    await sio.emit("frida_message", data)

def msg_handler(message, payload):
    asyncio.run_coroutine_threadsafe(broadcast_message(message.get("payload")), loop)

async def index(request):
    return web.Response(text="Socket.IO server running", content_type="text/plain")

app.router.add_get("/", index)

async def main():
    device = frida.get_usb_device()
    application = device.get_frontmost_application()
    session = device.attach(application.pid, realm="emulated")

    with open('agent.js', 'r', encoding='utf-8') as f:
        js = f.read()

    script = session.create_script(js)
    script.on("message", msg_handler)
    script.load()

    print("Socket.IO running on http://localhost:5000")

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "localhost", 5000)
    await site.start()

    while True:
        await asyncio.sleep(3600) 

loop.run_until_complete(main())
