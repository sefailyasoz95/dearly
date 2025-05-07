import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  FolderOpen,
  Users,
  Calendar,
  Plus,
  ChevronRight,
  Heart,
  Clock,
  BookMarked,
  CloudLightning,
} from "lucide-react";
import { createServer } from "@/lib/client";
import { cookies } from "next/headers";
import { Suspense } from "react";

// Mock data for server component
const mockAlbums = [
  {
    id: "1",
    created_at: "2025-01-01",
    name: "Summer Vacation 2024",
    parent_album_id: null,
    family_id: "1",
    cover_image:
      "https://images.unsplash.com/photo-1602002418082-dd67915aeaa5?q=80&w=500",
    is_active: true,
    count: 24,
  },
  {
    id: "2",
    created_at: "2025-02-15",
    name: "Birthday Party",
    parent_album_id: null,
    family_id: "1",
    cover_image:
      "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?q=80&w=500",
    is_active: true,
    count: 18,
  },
  {
    id: "3",
    created_at: "2025-03-20",
    name: "Family Reunion",
    parent_album_id: null,
    family_id: "1",
    cover_image:
      "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=500",
    is_active: true,
    count: 32,
  },
  {
    id: "4",
    created_at: "2025-04-10",
    name: "Easter",
    parent_album_id: null,
    family_id: "1",
    cover_image:
      "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?q=80&w=500",
    is_active: true,
    count: 15,
  },
];

const mockMedia = [
  {
    id: "1",
    created_at: "2025-04-30",
    is_image: true,
    url: "https://images.unsplash.com/photo-1484712401471-05c7215830eb?q=80&w=600",
    description: "Family picnic",
    family_id: "1",
    is_active: true,
  },
  {
    id: "2",
    created_at: "2025-04-28",
    is_image: true,
    url: "https://images.unsplash.com/photo-1484665754804-74b091922df5?q=80&w=600",
    description: "Kids playing",
    family_id: "1",
    is_active: true,
  },
  {
    id: "3",
    created_at: "2025-04-25",
    is_image: true,
    url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600",
    description: "Grandparents visit",
    family_id: "1",
    is_active: true,
  },
  {
    id: "4",
    created_at: "2025-04-20",
    is_image: false,
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=600",
    description: "Baby first steps",
    family_id: "1",
    is_active: true,
  },
  {
    id: "5",
    created_at: "2025-04-15",
    is_image: true,
    url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=600",
    description: "Park day",
    family_id: "1",
    is_active: true,
  },
  {
    id: "6",
    created_at: "2025-04-10",
    is_image: true,
    url: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?q=80&w=600",
    description: "School play",
    family_id: "1",
    is_active: true,
  },
];

const mockProfile = {
  id: "1",
  created_at: "2025-01-01",
  first_name: "John",
  last_name: "Smith",
  email: "john@example.com",
  birth_date: "1985-05-15",
  country: "United States",
  city: "New York",
  is_paying: true,
  family_id: "1",
  is_active: true,
};

const mockFamily = {
  id: "1",
  created_at: "2025-01-01",
  family_name: "Smith Family",
};

export default async function DashboardPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Calculate time passed since upload
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const familyMembers = [
    {
      name: "John Smith",
      email: "john@example.com",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200",
      role: "Admin",
    },
    {
      name: "Sara Smith",
      email: "sara@example.com",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
      role: "Member",
    },
    {
      name: "Michael Smith",
      email: "michael@example.com",
      avatar:
        "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=200",
      role: "Member",
    },
    {
      name: "Emma Smith",
      email: "emma@example.com",
      avatar:
        "https://images.unsplash.com/photo-1631680900243-3c207cf5a481?q=80&w=200",
      role: "Member",
    },
    {
      name: "David Smith",
      email: "david@example.com",
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200",
      role: "Member",
    },
  ];
  const supabase = await createServer({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: user, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", session?.user.email)
    .single();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with featured content */}
      <Suspense
        fallback={
          <div className="h-screen w-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-background z-10"></div>
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1920"
              alt="Family memories"
              fill
              style={{ objectFit: "cover" }}
              priority
              className="opacity-70"
            />
          </div>

          <div className="relative z-20 container mx-auto px-4 py-16 sm:py-24">
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-10 duration-700">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome back, {user?.first_name}!
              </h1>
              <p className="text-lg text-white/90">
                Today is the perfect day to cherish more family moments.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/upload"
                  className="group dark:text-white text-black backdrop-blur-md bg-white/20 text-primary hover:bg-primary hover:text-white dark:hover:text-black px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Upload New Memories
                </Link>
                <Link
                  href="/albums/create"
                  className="bg-white/20 backdrop-blur-sm dark:text-white text-black hover:bg-white/30 px-6 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  Create Album
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-16 relative z-30">
          {/* Quick access cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-card hover:bg-card/90 backdrop-blur-sm text-card-foreground rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] group">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-sm text-muted-foreground group-hover:text-accent-foreground transition-colors duration-300">
                    Albums
                  </span>
                  <span className="block text-3xl font-bold mt-1">
                    {mockAlbums.length}
                  </span>
                </div>
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FolderOpen className="w-6 h-6 text-accent-foreground" />
                </div>
              </div>
              <Link
                href="/albums"
                className="mt-4 inline-flex items-center text-sm text-muted-foreground hover:text-accent-foreground transition-colors duration-300"
              >
                View all
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="bg-card hover:bg-card/90 backdrop-blur-sm text-card-foreground rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] group">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-sm text-muted-foreground group-hover:text-accent-foreground transition-colors duration-300">
                    Photos & Videos
                  </span>
                  <span className="block text-3xl font-bold mt-1">
                    {mockMedia.length}
                  </span>
                </div>
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-6 h-6 text-accent-foreground" />
                </div>
              </div>
              <Link
                href="/media"
                className="mt-4 inline-flex items-center text-sm text-muted-foreground hover:text-accent-foreground transition-colors duration-300"
              >
                View all
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="bg-card hover:bg-card/90 backdrop-blur-sm text-card-foreground rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] group">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-sm text-muted-foreground group-hover:text-accent-foreground transition-colors duration-300">
                    Family Members
                  </span>
                  <span className="block text-3xl font-bold mt-1">
                    {familyMembers.length}
                  </span>
                </div>
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-accent-foreground" />
                </div>
              </div>
              <Link
                href="/family"
                className="mt-4 inline-flex items-center text-sm text-muted-foreground hover:text-accent-foreground transition-colors duration-300"
              >
                View all
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="bg-card hover:bg-card/90 backdrop-blur-sm text-card-foreground rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] group">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-sm text-muted-foreground group-hover:text-accent-foreground transition-colors duration-300">
                    Days Preserved
                  </span>
                  <span className="block text-3xl font-bold mt-1">142</span>
                </div>
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6 text-accent-foreground" />
                </div>
              </div>
              <Link
                href="/timeline"
                className="mt-4 inline-flex items-center text-sm text-muted-foreground hover:text-accent-foreground transition-colors duration-300"
              >
                View timeline
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Recent memories section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Memories</h2>
              <Link
                href="/media"
                className="text-primary hover:underline text-sm"
              >
                See all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockMedia.slice(0, 3).map((media, index) => (
                <div
                  key={media.id}
                  className="group relative rounded-xl overflow-hidden aspect-[4/3] cursor-pointer"
                >
                  <Image
                    src={media.url}
                    alt={media.description || "Family memory"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectFit: "cover" }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-medium text-lg">
                      {media.description}
                    </h3>
                    <span className="text-white/80 text-sm">
                      {getTimeAgo(media.created_at)}
                    </span>
                  </div>

                  {!media.is_image && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-8 h-8 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-colors duration-300">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Albums showcase with horizontal scroll */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Albums</h2>
              <Link
                href="/albums"
                className="text-primary hover:underline text-sm"
              >
                See all →
              </Link>
            </div>

            <div className="relative">
              <div className="flex overflow-x-auto gap-4 pb-6 -mx-4 px-4 scrollbar-hide snap-x">
                {mockAlbums.map((album) => (
                  <Link
                    href={`/albums/${album.id}`}
                    key={album.id}
                    className="group flex-none w-full sm:w-64 md:w-72 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 snap-start bg-card hover:translate-y-[-4px]"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={album.cover_image}
                        alt={album.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 text-white flex items-center">
                        <Camera className="w-4 h-4 mr-1" />
                        <span className="text-sm">{album.count}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{album.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(album.created_at)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="absolute right-0 bottom-6 flex gap-2">
                <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-md">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {/* Family members section */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border/50">
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                  <h2 className="text-xl font-bold">Family Members</h2>
                  <Link
                    href="/family/invite"
                    className="text-sm text-primary hover:underline"
                  >
                    + Invite
                  </Link>
                </div>

                <div className="divide-y divide-border/50">
                  {familyMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 hover:bg-muted/50 transition-colors duration-200"
                    >
                      <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 ring-2 ring-offset-2 ring-offset-background ring-primary/20">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          member.role === "Admin"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity & Stats */}
            <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border/50">
              <div className="p-4 border-b border-border/50">
                <h2 className="text-xl font-bold">Recent Activity</h2>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New memories uploaded</p>
                    <p className="text-sm text-muted-foreground">
                      Sara added 5 new photos to "Birthday Party"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      2 hours ago
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <BookMarked className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New album created</p>
                    <p className="text-sm text-muted-foreground">
                      You created "Summer Vacation 2024"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Yesterday
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Family member joined</p>
                    <p className="text-sm text-muted-foreground">
                      Michael accepted your invitation
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      3 days ago
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border/50">
                <Link
                  href="/activity"
                  className="text-sm text-primary hover:underline flex items-center justify-center"
                >
                  View all activity
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription status - keeping as requested */}
        <div className="container px-4 mx-auto mb-16">
          {mockProfile.is_paying ? (
            <div className="bg-gradient-to-r from-primary/90 to-primary/70 rounded-xl shadow-lg overflow-hidden backdrop-blur-lg border border-primary/10 animate-in fade-in-0 duration-700 hover:shadow-xl transition-shadow">
              <div className="p-6 text-primary-foreground relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-foreground/20 backdrop-blur-sm p-3 rounded-xl">
                    <CloudLightning className="w-6 h-6 text-primary-foreground" />
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-2">
                      Premium Family Account
                    </h3>
                    <p className="opacity-90">
                      Your memories are safely stored with unlimited storage.
                      Enjoy all premium features!
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href="/account/billing"
                        className="inline-block bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-medium px-4 py-2 rounded-lg transition duration-300"
                      >
                        Manage Subscription
                      </Link>
                      <Link
                        href="/help"
                        className="inline-block bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 font-medium px-4 py-2 rounded-lg transition duration-300"
                      >
                        Get Support
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border/50">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-muted p-3 rounded-xl">
                    <CloudLightning className="w-6 h-6 text-muted-foreground" />
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-2">
                      Upgrade to Premium
                    </h3>
                    <p className="text-muted-foreground">
                      Get unlimited storage, advanced organization features, and
                      more!
                    </p>

                    <div className="mt-4">
                      <Link
                        href="/pricing"
                        className="inline-block bg-primary text-primary-foreground font-medium px-4 py-2 rounded-lg hover:opacity-90 transition duration-300"
                      >
                        Upgrade Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
}
