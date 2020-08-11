import asyncio


loop = asyncio.new_event_loop()

async def do_other_things():
    print('doing other things')

def foo():
    loop2 = asyncio.new_event_loop()
    loop2.run_until_complete(do_other_things())
    loop2.close()


async def do_io():
    print('io start')
    await do_other_things()

    foo()

    print('io end')

loop.run_until_complete(do_io())
# loop.(do_other_things())

loop.close()