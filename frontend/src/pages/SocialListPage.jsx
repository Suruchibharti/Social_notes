import { UsersRound } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getFollowers, getFollowing } from "../api/users";
import UserCard from "../components/user/UserCard";
import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loader from "../components/ui/Loader";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";

export default function SocialListPage({ type }) {
  const { id } = useParams();
  const { user } = useAuth();
  const isFollowers = type === "followers";
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const state = useAsync(() => (isFollowers ? getFollowers(id || user?._id) : getFollowing()), [type, id, user?._id]);
  const list = isFollowers ? state.data?.followers : state.data?.following;
  const visibleList = (list || []).slice(0, page * pageSize);

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <h1>{isFollowers ? "Followers" : "Following"}</h1>
        </div>
        <UsersRound size={24} className="header-icon" />
      </div>
      <ErrorMessage message={state.error} />
      {state.loading && <Loader label="Loading people" />}
      {!state.loading && visibleList.map((person) => (
        <UserCard
          key={person._id}
          user={person}
          forceFollowing={!isFollowers}
          onFollowChange={(isFollowingNow) => {
            if (!isFollowers && !isFollowingNow) {
              state.setData({
                ...state.data,
                following: state.data.following.filter((item) => item._id !== person._id)
              });
              return;
            }
            state.run();
          }}
        />
      ))}
      {!state.loading && list?.length === 0 && (
        <EmptyState
          title={isFollowers ? "No followers yet" : "You are not following anyone yet"}
          text={isFollowers ? "Share more notes to grow your circle." : "Discover people and follow writers you like."}
        />
      )}
      {!state.loading && visibleList.length < (list?.length || 0) && (
        <button className="secondary-btn load-more-btn" onClick={() => setPage((value) => value + 1)}>
          Load more users
        </button>
      )}
    </section>
  );
}
