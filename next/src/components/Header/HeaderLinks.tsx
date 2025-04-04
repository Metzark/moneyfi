"use client";

import styles from "./HeaderLinks.module.css";
import { useSupabase } from "@/lib/supabase/context";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function HeaderLinks() {
  const { user, supabase }: { user: User | null; supabase: SupabaseClient } = useSupabase();

  const router = useRouter();

  // Handle logging the user out
  const handleLogout = async () => {
    const { error }: { error: Error | null } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }

    router.push("/login");
  };

  return (
    <div className={styles.links}>
      <button className={styles.login} title="Login" onClick={() => (user ? handleLogout() : router.push("/login"))}>
        {user ? <LogoutIcon /> : <UserIcon />}
      </button>
    </div>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="1em" fill="currentColor">
      <path d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7l131.7 0c0 0 0 0 .1 0l5.5 0 112 0 5.5 0c0 0 0 0 .1 0l131.7 0c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2L224 304l-19.7 0c-12.4 0-20.1 13.6-13.7 24.2z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="1em" fill="currentColor">
      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
    </svg>
  );
}
