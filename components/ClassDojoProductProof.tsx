import Image from 'next/image';

export default function ClassDojoProductProof() {
  return (
    <figure className="classdojo-product-proof">
      <div className="classdojo-product-proof__image">
        <Image
          src="/quick-grid-note-sheet.jpg"
          alt="ShortHand Quick Grid quick-note sheet showing behavior indicators, an optional note field, and a Save button"
          width={1080}
          height={2119}
          sizes="(max-width: 600px) 72vw, 230px"
        />
      </div>
      <figcaption className="classdojo-product-proof__caption">
        <span className="classdojo-product-proof__label">Here is what this actually looks like.</span>
        <span>
          Tap the student, tap the behavior you saw, and save. Add a note if you want more
          detail. The record stays private to the teacher.
        </span>
      </figcaption>
    </figure>
  );
}
