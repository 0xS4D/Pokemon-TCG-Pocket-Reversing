# Pokemon-TCG-Pocket-Reversing
This repository contains everything I've found so far in an attempt to reverse-engineer Pokémon TCG Pocket. My ultimate goal is to capture the packets being sent, as shown in this video: https://www.youtube.com/watch?v=oJhGaOrd1qU

I've already tried SSL pinning with existing Frida scripts, conducted a static analysis with MobSF, performed a memory dump with Fridump, and experimented with most MITM applications, including Wireshark. However, I'm stuck without bypassing SSL pinning.

I'm not sure how to find more information using the available Unity files. I tried working with the files on hand (libil2cpp.so) but with no success.

#UPDATE:

Many people add me on Discord for the same reason... so to avoid repeating myself all the time, this message might help…

This is everything I’ve managed so far:
The global-metadata.dat is obfuscated. Instead of decrypting it step by step, what I did was create a script to dump it directly from memory by searching for headers once the entire deobfuscation process had finished.
On iOS, il2cpp.so is called UnityFramework. I was able to obtain both global-metadata.dat files from iOS and Android.
Once I got the dummy.dlls, I noticed differences. On iOS, typical Unity functions are "stripped"; the obfuscation on iOS is stronger.
The only exported module on iOS is CRIWARECE8DBD94.
I tried using frida-il2cpp-bridge to hook Unity functions on Android and couldn’t get it working, until someone on the server (UnityPy) recommended only hooking the app after it opens — that is, open the app and then hook it with Frida. I was able to do it. (Someone implemented a bash script to open the app, get the process ID, and hook it by PID — all automatic and fast — so it turned out to be unnecessary to overcomplicate it.)
While analyzing the dummy I found Ceal. It’s not the entire SSL pinning. I think it's only when a first SSL Pinning is running. Several requests are made, not just with Ceal. There’s another request I haven’t been able to capture. Someone managed to get all the .proto files needed to read the traffic over gRPC. But if we can’t bypass the pinning, we can’t move forward either. There are other interesting things in the dummy that others found (sometimes certain hooks crash the app, and this is why): Lettuce.Infrastructure.Rainbow. It contains a function called Chs, which you can read the arguments of using dnSpy:

Chs(ref bool debugger, ref bool emulator, ref bool frida, ref bool jailbreakAndRooted, ref bool modifyBinary, ref bool modifyFirePoint, ref bool modifyFunction, ref bool vspaceApp, ref bool modifyMemory)
It also returns a boolean. That prevents the app from crashing many times. (In my testing, it never crashed.)

Maybe it gets triggered when you try to modify other things.

Il2Cpp.domain.assembly("Lettuce.Infrastructure.Rainbow").image.tryClass("Foundation.Rainbow.Runtime.Rainbow").method("Chs").implementation = function(...a) {
}

idkwhatimsaying words: this works until you're past the country selection screen — idk what comes after.

Then I tried hooking things like ProfileV1, but that’s where I stopped. I couldn’t figure out which functions are making the gRPC requests or how they’re being handled
