import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const createMedia = (width: number) => ({
  isMobile: width < 768,
  isTablet: width >= 768 && width <= 1124,
  isDesktop: width > 1124,
});

const useMedia = () => {
  const [media, setMedia] = useState(
    createMedia(Dimensions.get('window').width),
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const newMedia = createMedia(window.width);
      if (
        newMedia.isMobile !== media.isMobile ||
        newMedia.isTablet !== media.isTablet ||
        newMedia.isDesktop !== media.isDesktop
      ) {
        setMedia(newMedia);
      }
    });

    return () => subscription.remove();
  }, [media]);

  return media;
};

export default useMedia;
