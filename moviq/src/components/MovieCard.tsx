import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import { getMoviePosterUrl } from '@/utils/api';

interface MovieCardProps {
  movie: Movie;
  onFavoriteToggle?: (movie: Movie) => void;
  isFavorite?: boolean;
}

const Card = styled.div`
  position: relative;
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }

  &:active {
    transform: translateY(-2px) scale(0.98);
    transition: ${({ theme }) => theme.transitions.fast};
  }
`;

const PosterContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.7) 100%
    );
    opacity: 0.5;
    transition: ${({ theme }) => theme.transitions.default};
  }

  ${Card}:hover &::after {
    opacity: 0.8;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0.7) 100%
    );
  }

  img {
    transition: ${({ theme }) => theme.transitions.default};
  }

  ${Card}:hover img {
    transform: scale(1.05);
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.space.md};
  transition: ${({ theme }) => theme.transitions.default};

  ${Card}:hover & {
    background-color: ${({ theme }) => `${theme.colors.surface}CC`};
  }
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.space.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: ${({ theme }) => theme.transitions.default};

  ${Card}:hover & {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ReleaseDate = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.sm};
  transition: ${({ theme }) => theme.transitions.default};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: ${({ theme }) => theme.transitions.default};

  ${Card}:hover & {
    color: ${({ theme }) => theme.colors.text};
  }
`;

interface FavoriteButtonProps {
  isFavorite?: boolean;
}

const FavoriteButton = styled.button<FavoriteButtonProps>`
  position: absolute;
  top: ${({ theme }) => theme.space.sm};
  right: ${({ theme }) => theme.space.sm};
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, isFavorite }) => 
    isFavorite ? theme.colors.primary : theme.colors.text};
  z-index: 10;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }
`;

const MovieCard: React.FC<MovieCardProps> = ({ movie, onFavoriteToggle, isFavorite }) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(movie);
    }
  };

  return (
    <Link href={`/movie/${movie.id}`} passHref>
      <Card>
        <PosterContainer>
          <Image
            src={getMoviePosterUrl(movie.poster_path)}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{ objectFit: 'cover' }}
          />
          {onFavoriteToggle && (
            <FavoriteButton 
              onClick={handleFavoriteClick}
              isFavorite={isFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? '❤️' : '🤍'}
            </FavoriteButton>
          )}
        </PosterContainer>
        <Content>
          <Title>{movie.title}</Title>
          <ReleaseDate>
            {new Date(movie.release_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </ReleaseDate>
          <Rating>
            ⭐ {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
          </Rating>
        </Content>
      </Card>
    </Link>
  );
};

export default MovieCard;
