have to update the routes

# at 26th dec

- complete the basic websocket handshakes
- not yet -- done
1. does NOT know who is online -  done

2. cannot validate if a DM target exists -  done

3. cannot auto-route properly - implemented room (_Room)

- next-

add msg customizing capability + clean up (server)

in backend add a boundary condition for : " Online :  [] " ---  done adjusted with conditioning

startting clean up --


may be can use "Zod" for stricter run time validation


-- complete the db connection from the entry point .

--- got Auth Error in config :
happens due to : await mongoose.connect(uri);
-- username and password corrected in the URI of Atlas

TODO: 
add ---
1. CLI chat client done 


TODO: - 

2. Rate limiting / spam protection

3. Typing indicators

4. Read receipts

5. Auth (JWT) ← only after all above

try to add the type from the cjs to ESM
