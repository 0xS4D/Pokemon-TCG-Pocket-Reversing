# Pokemon-TCG-Pocket-Reversing
This repository contains everything I've found so far in an attempt to reverse-engineer Pokémon TCG Pocket. My ultimate goal is to capture the packets being sent, as shown in this video: https://www.youtube.com/watch?v=oJhGaOrd1qU

I've already tried SSL pinning with existing Frida scripts, conducted a static analysis with MobSF, performed a memory dump with Fridump, and experimented with most MITM applications, including Wireshark. However, I'm stuck without bypassing SSL pinning.

I'm not sure how to find more information using the available Unity files. I tried working with the files on hand (libil2cpp.so) but with no success.
